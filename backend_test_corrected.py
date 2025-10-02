#!/usr/bin/env python3
"""
Backend API Testing Script - Corrected Version
Tests with both card_number (string) and card_numbers (array) to verify current backend behavior.
"""

import requests
import json
import sys

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("❌ Could not get REACT_APP_BACKEND_URL from frontend/.env")
    sys.exit(1)

print(f"🔗 Testing backend at: {BASE_URL}")

def test_create_order_with_card_number_string():
    """Test POST /api/orders with card_number as string (as requested in review)"""
    print("\n📝 Test: POST /api/orders with card_number (string)")
    
    test_order = {
        "student_name": "أحمد محمد علي",
        "telegram_username": "@ahmed_test",
        "phone_number": "07901234567",
        "grade": "السادس ابتدائي",
        "purchase_type": "single",
        "selected_subjects": ["الرياضيات", "اللغة العربية"],
        "card_number": "1234567890123456"  # Using card_number as string
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/orders", 
            json=test_order,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code not in [200, 201]:
            print(f"❌ Expected 200/201, got {response.status_code}")
            print(f"Response: {response.text}")
            return None, False
            
        order_data = response.json()
        print(f"Response: {json.dumps(order_data, ensure_ascii=False, indent=2)}")
        
        # Check if card information is preserved
        card_numbers = order_data.get('card_numbers', [])
        if not card_numbers:
            print("⚠️ ISSUE: card_number sent as string but card_numbers is empty in response")
            print("This suggests backend doesn't handle card_number (string) field")
            return order_data.get('id'), False
        else:
            print("✅ Card information preserved correctly")
            return order_data.get('id'), True
            
    except Exception as e:
        print(f"❌ Error testing POST /api/orders with card_number: {e}")
        return None, False

def test_create_order_with_card_numbers_array():
    """Test POST /api/orders with card_numbers as array (backend's expected format)"""
    print("\n📝 Test: POST /api/orders with card_numbers (array)")
    
    test_order = {
        "student_name": "فاطمة أحمد",
        "telegram_username": "@fatima_test",
        "phone_number": "07901234568",
        "grade": "الثالث متوسط",
        "purchase_type": "all",
        "selected_subjects": [],
        "card_numbers": ["1234567890123456", "9876543210987654"]  # Using card_numbers as array
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/orders", 
            json=test_order,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code not in [200, 201]:
            print(f"❌ Expected 200/201, got {response.status_code}")
            print(f"Response: {response.text}")
            return None, False
            
        order_data = response.json()
        print(f"Response: {json.dumps(order_data, ensure_ascii=False, indent=2)}")
        
        # Check if card information is preserved
        card_numbers = order_data.get('card_numbers', [])
        if len(card_numbers) == 2:
            print("✅ Card numbers preserved correctly")
            return order_data.get('id'), True
        else:
            print(f"⚠️ ISSUE: Expected 2 card numbers, got {len(card_numbers)}")
            return order_data.get('id'), False
            
    except Exception as e:
        print(f"❌ Error testing POST /api/orders with card_numbers: {e}")
        return None, False

def main():
    """Run backend tests to understand current behavior"""
    print("🚀 Testing Backend Card Number Handling")
    print("=" * 60)
    
    # Test with card_number (string) - as requested in review
    order_id_1, card_string_works = test_create_order_with_card_number_string()
    
    # Test with card_numbers (array) - backend's expected format
    order_id_2, card_array_works = test_create_order_with_card_numbers_array()
    
    # Clean up test orders
    if order_id_1:
        try:
            requests.delete(f"{BASE_URL}/api/orders/{order_id_1}", timeout=10)
            print(f"🗑️ Cleaned up test order: {order_id_1}")
        except:
            pass
            
    if order_id_2:
        try:
            requests.delete(f"{BASE_URL}/api/orders/{order_id_2}", timeout=10)
            print(f"🗑️ Cleaned up test order: {order_id_2}")
        except:
            pass
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 BACKEND BEHAVIOR ANALYSIS")
    print("=" * 60)
    
    print(f"card_number (string) handling: {'✅ Works' if card_string_works else '❌ Not working'}")
    print(f"card_numbers (array) handling: {'✅ Works' if card_array_works else '❌ Not working'}")
    
    if not card_string_works and card_array_works:
        print("\n🔍 FINDING: Backend only accepts 'card_numbers' (array), not 'card_number' (string)")
        print("The review request asks to test with 'card_number' but backend expects 'card_numbers'")
        print("This is a mismatch between the review requirements and actual backend implementation.")
    
    return card_string_works or card_array_works

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)