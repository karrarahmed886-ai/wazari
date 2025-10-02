from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import httpx
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class GradeType(str, Enum):
    SIXTH_PRIMARY = "السادس ابتدائي"
    THIRD_INTERMEDIATE = "الثالث متوسط"
    SIXTH_PREPARATORY_SCIENTIFIC = "السادس إعدادي - علمي"
    SIXTH_PREPARATORY_LITERARY = "السادس إعدادي - أدبي"

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"

class PurchaseType(str, Enum):
    SINGLE_SUBJECT = "single"
    ALL_SUBJECTS = "all"

# Models
class Subject(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    grade: GradeType
    image_urls: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SubjectCreate(BaseModel):
    name: str
    grade: GradeType
    image_urls: List[str] = []

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_name: str
    telegram_username: Optional[str] = ""
    phone_number: Optional[str] = ""
    email: Optional[str] = ""
    contact_method: Optional[str] = None
    contact_value: Optional[str] = None
    client_key: Optional[str] = None
    grade: GradeType
    purchase_type: PurchaseType
    selected_subjects: List[str] = []  # Subject IDs for single purchases
    card_numbers: List[str] = []
    total_amount: int  # in USD
    status: OrderStatus = OrderStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    confirmed_at: Optional[datetime] = None

class OrderCreateFlex(BaseModel):
    student_name: str
    telegram_username: Optional[str] = ""
    phone_number: Optional[str] = ""
    email: Optional[str] = ""
    contact_method: Optional[str] = None
    contact_value: Optional[str] = None
    client_key: Optional[str] = None
    grade: str
    purchase_type: str
    selected_subjects: Optional[List[str]] = []
    card_numbers: Optional[List[str]] = None
    card_number: Optional[str] = None

class OrderUpdate(BaseModel):
    status: OrderStatus
    admin_notes: Optional[str] = None

# Default subjects for each grade
DEFAULT_SUBJECTS = {
    GradeType.SIXTH_PRIMARY: [
        "الرياضيات", "اللغة العربية", "اللغة الإنجليزية", "العلوم", 
        "الاجتماعيات", "التربية الإسلامية"
    ],
    GradeType.THIRD_INTERMEDIATE: [
        "الرياضيات", "اللغة العربية", "اللغة الإنجليزية", "الفيزياء", 
        "الكيمياء", "الأحياء", "الاجتماعيات", "التربية الإسلامية"
    ],
    GradeType.SIXTH_PREPARATORY_SCIENTIFIC: [
        "الرياضيات", "اللغة العربية", "اللغة الإنجليزية", "الفيزياء", 
        "الكيمياء", "الأحياء", "التربية الإسلامية"
    ],
    GradeType.SIXTH_PREPARATORY_LITERARY: [
        "الرياضيات", "اللغة العربية", "اللغة الإنجليزية", "التاريخ", 
        "الجغرافيا", "الاقتصاد", "التربية الإسلامية"
    ]
}

# Initialize default subjects
async def init_default_subjects():
    # Clear existing subjects first
    await db.subjects.delete_many({})
    
    # Add new subjects according to the updated structure
    for grade, subjects in DEFAULT_SUBJECTS.items():
        for subject_name in subjects:
            subject = Subject(name=subject_name, grade=grade)
            await db.subjects.insert_one(subject.dict())

# Routes
@api_router.get("/")
async def root():
    return {"message": "مرحباً بك في موقع الأسئلة الوزارية"}

@api_router.get("/grades")
async def get_grades():
    return {
        "grades": [
            {"id": "sixth_primary", "name": "السادس ابتدائي", "value": GradeType.SIXTH_PRIMARY},
            {"id": "third_intermediate", "name": "الثالث متوسط", "value": GradeType.THIRD_INTERMEDIATE},
            {"id": "sixth_preparatory_scientific", "name": "السادس إعدادي - علمي", "value": GradeType.SIXTH_PREPARATORY_SCIENTIFIC},
            {"id": "sixth_preparatory_literary", "name": "السادس إعدادي - أدبي", "value": GradeType.SIXTH_PREPARATORY_LITERARY}
        ]
    }

@api_router.get("/subjects/{grade}")
async def get_subjects(grade: GradeType):
    subjects = await db.subjects.find({"grade": grade}).to_list(1000)
    return [Subject(**subject) for subject in subjects]

@api_router.get("/pricing")
async def get_pricing():
    return {
        "single_subject": {
            "price": 10,
            "currency": "USD",
            "description": "مادة واحدة - كارت رصيد 10$"
        },
        "all_subjects": {
            "price": 50,
            "currency": "USD", 
            "description": "جميع المواد - كارت رصيد 50$"
        }
    }

@api_router.post("/orders/simple")
async def create_order_simple(data: dict):
    try:
        # Extract fields with defaults
        student_name = data.get("student_name", "").strip()
        telegram_username = (data.get("telegram_username") or "").strip()
        phone_number = (data.get("phone_number") or "").strip()
        email = (data.get("email") or "").strip()
        contact_method = data.get("contact_method")
        contact_value = data.get("contact_value")
        client_key = data.get("client_key")
        grade = data.get("grade")
        purchase_type = data.get("purchase_type", "single")
        selected_subjects = data.get("selected_subjects") or []
        # Cards: accept both formats
        cards = []
        if isinstance(data.get("card_numbers"), list):
            cards = [str(c).replace(" ", "").strip() for c in data["card_numbers"] if str(c).strip()]
        elif isinstance(data.get("card_number"), str):
            cards = [x.strip() for x in data["card_number"].split(",") if x.strip()]

        # Compute amount
        total_amount = 50 if purchase_type == "all" else max(len(selected_subjects), 1) * 10

        # Build order dict
        order = {
            "id": str(uuid.uuid4()),
            "student_name": student_name,
            "telegram_username": telegram_username,
            "phone_number": phone_number,
            "email": email,
            "contact_method": contact_method,
            "contact_value": contact_value,
            "client_key": client_key,
            "grade": grade,
            "purchase_type": purchase_type,
            "selected_subjects": selected_subjects,
            "card_numbers": cards,
            "total_amount": total_amount,
            "status": "pending",
            "created_at": datetime.utcnow(),
            "confirmed_at": None,
        }

        await db.orders.insert_one(order)

        # Telegram notify (best-effort)
        tg_token = os.environ.get("TELEGRAM_BOT_TOKEN")
        tg_chat = os.environ.get("TELEGRAM_CHAT_ID")
        if tg_token and tg_chat:
            cards_text = "\n".join([f"• {c}" for c in (order["card_numbers"] or [])]) or "—"
            text = (
                f"طلب جديد ✅\n"
                f"الطالب: {order['student_name']}\n"
                f"الصف: {order['grade']}\n"
                f"النوع: {'جميع المواد' if order['purchase_type']=='all' else f'مواد منفردة ({len(order['selected_subjects'])})'}\n"
                f"المبلغ: ${order['total_amount']}\n"
                f"التواصل: {order.get('contact_method','') or ''} {order.get('contact_value','') or ''}\n"
                f"الكروت:\n{cards_text}\n"
                f"رقم الطلب: {order['id']}"
            )
            try:
                await send_telegram_message(tg_token, tg_chat, text)
            except Exception:
                pass

        return {"ok": True, "order": order}
    except Exception as e:
        return {"ok": False, "error": str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR

@api_router.post("/orders")
async def create_order(order_data: OrderCreateFlex):
    # Calculate total amount
    # Coerce enums from strings
    pt = str(order_data.purchase_type)
    purchase = PurchaseType.SINGLE_SUBJECT if pt in ["single", PurchaseType.SINGLE_SUBJECT] else PurchaseType.ALL_SUBJECTS
    # subjects
    selected_subjects = order_data.selected_subjects or []
    if purchase == PurchaseType.ALL_SUBJECTS:
        # When client sends empty subjects for 'all', keep empty; admin understands it
        pass

    # Calculate total amount
    total_amount = (len(selected_subjects) * 10) if purchase == PurchaseType.SINGLE_SUBJECT else 50

    # Normalize and validate card numbers from array or single joined string
    cards = []
    if order_data.card_numbers:
        cards = [cn.replace(" ", "") for cn in order_data.card_numbers if cn and cn.strip()]
    elif order_data.card_number:
        cards = [c.strip() for c in order_data.card_number.split(",") if c.strip()]

    # Create order
    order = Order(
        student_name=order_data.student_name,
        telegram_username=order_data.telegram_username or "",
        phone_number=order_data.phone_number or "",
        email=getattr(order_data, 'email', ""),
        contact_method=getattr(order_data, 'contact_method', None),
        contact_value=getattr(order_data, 'contact_value', None),
        client_key=getattr(order_data, 'client_key', None),
        grade=GradeType(order_data.grade),
        purchase_type=purchase,
        selected_subjects=selected_subjects,
        card_numbers=cards,
        total_amount=total_amount
    )

    # Save order
    await db.orders.insert_one(order.dict())

    # Telegram notification (optional)
    tg_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    tg_chat = os.environ.get("TELEGRAM_CHAT_ID")
    if tg_token and tg_chat:
        try:
            cards_text = "\n".join([f"• {c}" for c in (order.card_numbers or [])]) or "—"
            subjects_count = len(order.selected_subjects)
            text = (
                f"طلب جديد ✅\n"
                f"الطالب: {order.student_name}\n"
                f"الصف: {order.grade}\n"
                f"النوع: {'جميع المواد' if order.purchase_type == PurchaseType.ALL_SUBJECTS else f'مواد منفردة ({subjects_count})'}\n"
                f"المبلغ: ${order.total_amount}\n"
                f"التواصل: {order.contact_method or ''} {order.contact_value or ''}\n"
                f"الكروت:\n{cards_text}\n"
                f"رقم الطلب: {order.id}"
            )
            await send_telegram_message(tg_token, tg_chat, text)
        except Exception:
            pass

    return order.dict().dict()

@api_router.get("/orders")
async def get_orders(status: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    
    orders = await db.orders.find(query).sort("created_at", -1).to_list(1000)
    return [Order(**order) for order in orders]

@api_router.put("/orders/{order_id}")
async def update_order(order_id: str, update_data: OrderUpdate):
    update_dict = update_data.dict(exclude_unset=True)

    if update_data.status == OrderStatus.CONFIRMED:
        update_dict["confirmed_at"] = datetime.utcnow()

    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": update_dict}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")

    updated_order = await db.orders.find_one({"id": order_id})
    return Order(**updated_order)

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**order)

@api_router.delete("/orders/{order_id}")
async def delete_order(order_id: str):
    result = await db.orders.delete_one({"id": order_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted successfully"}

# Subject management (for admin)
@api_router.post("/subjects", response_model=Subject)
async def create_subject(subject_data: SubjectCreate):
    subject = Subject(**subject_data.dict())
    await db.subjects.insert_one(subject.dict())
    return subject

@api_router.put("/subjects/{subject_id}")
async def update_subject(subject_id: str, subject_data: SubjectCreate):
    result = await db.subjects.update_one(
        {"id": subject_id},
        {"$set": subject_data.dict()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    updated_subject = await db.subjects.find_one({"id": subject_id})
    return Subject(**updated_subject)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await init_default_subjects()
    logger.info("Application started successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()