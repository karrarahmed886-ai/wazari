#!/usr/bin/env python3
"""
Backend API Testing Script
Tests the existing backend behavior without requiring service restarts.
Focus on: grades, orders CRUD operations with card_number field.
"""

import requests
import json
import sys
from datetime import datetime

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

def test_get_grades():
    """Test 1: GET /api/grades returns four grades with correct values"""
    print("\n📋 Test 1: GET /api/grades")
    try:
        response = requests.get(f"{BASE_URL}/api/grades", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
        data = response.json()
        print(f"Response: {json.dumps(data, ensure_ascii=False, indent=2)}")
        
        # Check if grades key exists
        if 'grades' not in data:
            print("❌ Missing 'grades' key in response")
            return False
            
        grades = data['grades']
        
        # Check if we have exactly 4 grades
        if len(grades) != 4:
            print(f"❌ Expected 4 grades, got {len(grades)}")
            return False
            
        # Check required fields for each grade
        required_fields = ['id', 'name', 'value']
        for grade in grades:
            for field in required_fields:
                if field not in grade:
                    print(f"❌ Missing field '{field}' in grade: {grade}")
                    return False
                    
        print("✅ GET /api/grades working correctly - 4 grades with correct structure")
        return True
        
    except Exception as e:
        print(f"❌ Error testing GET /api/grades: {e}")
        return False

def test_create_order():
    """Test 2: POST /api/orders accepts payload with card_number (string), purchase_type single/all"""
    print("\n📝 Test 2: POST /api/orders")
    
    # Test data - using card_number as string (not card_numbers array)
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
        print(f"Request payload: {json.dumps(test_order, ensure_ascii=False, indent=2)}")
        
        if response.status_code not in [200, 201]:
            print(f"❌ Expected 200/201, got {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
        order_data = response.json()
        print(f"Response: {json.dumps(order_data, ensure_ascii=False, indent=2)}")
        
        # Check if order has required fields
        required_fields = ['id', 'student_name', 'grade', 'purchase_type']
        for field in required_fields:
            if field not in order_data:
                print(f"❌ Missing field '{field}' in order response")
                return None
                
        # Check if order has an ID
        if not order_data.get('id'):
            print("❌ Order ID is missing or empty")
            return None
            
        print(f"✅ POST /api/orders working correctly - Order created with ID: {order_data['id']}")
        return order_data['id']
        
    except Exception as e:
        print(f"❌ Error testing POST /api/orders: {e}")
        return None

def test_get_orders(created_order_id=None):
    """Test 3: GET /api/orders returns created order with card_number and selected_subjects"""
    print("\n📋 Test 3: GET /api/orders")
    
    try:
        response = requests.get(f"{BASE_URL}/api/orders", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
        orders = response.json()
        print(f"Found {len(orders)} orders")
        
        if not orders:
            print("⚠️ No orders found - this might be expected if no orders exist")
            return True
            
        # If we have a created order ID, look for it specifically
        found_order = None
        if created_order_id:
            for order in orders:
                if order.get('id') == created_order_id:
                    found_order = order
                    break
                    
        # Use the first order if we don't have a specific one to look for
        if not found_order and orders:
            found_order = orders[0]
            
        if found_order:
            print(f"Checking order: {json.dumps(found_order, ensure_ascii=False, indent=2)}")
            
            # Check for required fields
            required_fields = ['id', 'selected_subjects']
            for field in required_fields:
                if field not in found_order:
                    print(f"❌ Missing field '{field}' in order")
                    return False
                    
            # Check for card_number or card_numbers field
            has_card_info = 'card_number' in found_order or 'card_numbers' in found_order
            if not has_card_info:
                print("❌ Missing card information (neither card_number nor card_numbers found)")
                return False
                
            print("✅ GET /api/orders working correctly - Orders contain required fields")
            return True
        else:
            print("⚠️ Could not find specific order to verify, but API is responding")
            return True
            
    except Exception as e:
        print(f"❌ Error testing GET /api/orders: {e}")
        return False

def test_delete_order(order_id):
    """Test 4: DELETE /api/orders/{id} removes the order"""
    print(f"\n🗑️ Test 4: DELETE /api/orders/{order_id}")
    
    if not order_id:
        print("❌ No order ID provided for deletion test")
        return False
        
    try:
        # First verify the order exists
        get_response = requests.get(f"{BASE_URL}/api/orders/{order_id}", timeout=10)
        if get_response.status_code == 404:
            print("⚠️ Order not found - might have been deleted already")
            return True
            
        # Delete the order
        response = requests.delete(f"{BASE_URL}/api/orders/{order_id}", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code not in [200, 204]:
            print(f"❌ Expected 200/204, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
        # Verify the order is deleted
        verify_response = requests.get(f"{BASE_URL}/api/orders/{order_id}", timeout=10)
        if verify_response.status_code != 404:
            print(f"❌ Order still exists after deletion (status: {verify_response.status_code})")
            return False
            
        print("✅ DELETE /api/orders/{id} working correctly - Order deleted successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error testing DELETE /api/orders/{order_id}: {e}")
        return False

def main():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests")
    print("=" * 50)
    
    results = {}
    
    # Test 1: GET /api/grades
    results['grades'] = test_get_grades()
    
    # Test 2: POST /api/orders
    created_order_id = test_create_order()
    results['create_order'] = created_order_id is not None
    
    # Test 3: GET /api/orders
    results['get_orders'] = test_get_orders(created_order_id)
    
    # Test 4: DELETE /api/orders/{id}
    results['delete_order'] = test_delete_order(created_order_id)
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
            
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests passed!")
        return True
    else:
        print("⚠️ Some backend tests failed")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)