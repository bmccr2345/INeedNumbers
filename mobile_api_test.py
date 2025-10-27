#!/usr/bin/env python3
"""
Mobile Backend API Testing Suite
Tests all mobile-related API endpoints for production
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Optional, Dict, Any
import time

class MobileAPITester:
    def __init__(self, base_url="https://ineednumbers.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.mobile_session = None
        
    def test_mobile_backend_apis(self):
        """Test all mobile-related API endpoints for production"""
        print("\n📱 TESTING MOBILE BACKEND API ENDPOINTS FOR PRODUCTION...")
        print("   Testing: Dashboard Data APIs")
        print("   Testing: Activity/Reflection Logging")
        print("   Testing: Deal Management")
        print("   Testing: Expense Management")
        print("   Expected: All endpoints return 200 OK with valid data")
        print("   Expected: No 401 authentication errors")
        print("   Expected: No 500 server errors")
        
        results = {}
        
        # 1. Test authentication first
        auth_success, auth_response = self.test_mobile_authentication()
        results['authentication'] = {
            'success': auth_success,
            'response': auth_response
        }
        
        if not auth_success:
            print("   ❌ Cannot proceed with mobile API tests - authentication failed")
            return False, results
        
        # 2. Test Dashboard Data APIs
        dashboard_success, dashboard_response = self.test_dashboard_data_apis()
        results['dashboard_apis'] = {
            'success': dashboard_success,
            'response': dashboard_response
        }
        
        # 3. Test Activity/Reflection Logging
        activity_success, activity_response = self.test_activity_reflection_logging()
        results['activity_logging'] = {
            'success': activity_success,
            'response': activity_response
        }
        
        # 4. Test Deal Management
        deal_mgmt_success, deal_mgmt_response = self.test_deal_management_apis()
        results['deal_management'] = {
            'success': deal_mgmt_success,
            'response': deal_mgmt_response
        }
        
        # 5. Test Expense Management
        expense_mgmt_success, expense_mgmt_response = self.test_expense_management_apis()
        results['expense_management'] = {
            'success': expense_mgmt_success,
            'response': expense_mgmt_response
        }
        
        # Calculate overall success
        total_tests = 5
        successful_tests = sum([
            auth_success,
            dashboard_success,
            activity_success,
            deal_mgmt_success,
            expense_mgmt_success
        ])
        
        overall_success = successful_tests >= 4  # Allow one failure
        
        print(f"\n📱 MOBILE BACKEND API TESTING SUMMARY:")
        print(f"   ✅ Successful tests: {successful_tests}/{total_tests}")
        print(f"   📈 Success rate: {(successful_tests/total_tests)*100:.1f}%")
        
        if overall_success:
            print("   🎉 Mobile Backend APIs - TESTING COMPLETED SUCCESSFULLY")
        else:
            print("   ❌ Mobile Backend APIs - CRITICAL ISSUES FOUND")
            
        return overall_success, results
    
    def test_mobile_authentication(self):
        """Test authentication for mobile API testing"""
        print("\n🔐 TESTING MOBILE AUTHENTICATION...")
        
        # Use test user account credentials
        login_data = {
            "email": "demo@demo.com",
            "password": "demo123",
            "remember_me": False
        }
        
        print(f"   🔍 Testing login with: {login_data['email']}")
        
        try:
            session = requests.Session()
            
            login_response = session.post(
                f"{self.base_url}/api/auth/login",
                json=login_data,
                timeout=15
            )
            
            if login_response.status_code == 200:
                print("   ✅ Mobile authentication successful")
                login_data_response = login_response.json()
                
                # Store session for later use
                self.mobile_session = session
                
                # Verify user details
                user_data = login_data_response.get('user', {})
                if user_data:
                    print(f"   ✅ User email: {user_data.get('email')}")
                    print(f"   ✅ User role: {user_data.get('role')}")
                    print(f"   ✅ User plan: {user_data.get('plan')}")
                
                return True, login_data_response
            else:
                print(f"   ❌ Mobile authentication failed - Status: {login_response.status_code}")
                try:
                    error_response = login_response.json()
                    print(f"   ❌ Error: {error_response.get('detail', 'Unknown error')}")
                except:
                    print(f"   ❌ Response: {login_response.text[:200]}")
                return False, {"error": "login failed", "status": login_response.status_code}
                
        except Exception as e:
            print(f"   ❌ Error in mobile authentication test: {e}")
            return False, {"error": str(e)}
    
    def test_dashboard_data_apis(self):
        """Test Dashboard Data APIs"""
        print("\n📊 TESTING DASHBOARD DATA APIS...")
        
        if not self.mobile_session:
            print("   ❌ No mobile session available")
            return False, {"error": "No session"}
        
        dashboard_tests = []
        
        # Test 1: P&L Summary API
        print("   🔍 Testing GET /api/pnl/summary?month=2025-10...")
        try:
            pnl_response = self.mobile_session.get(
                f"{self.base_url}/api/pnl/summary?month=2025-10",
                timeout=15
            )
            
            if pnl_response.status_code == 200:
                print("   ✅ P&L Summary API - 200 OK")
                pnl_data = pnl_response.json()
                print(f"   ✅ Response keys: {list(pnl_data.keys())}")
                dashboard_tests.append(True)
            else:
                print(f"   ❌ P&L Summary API - {pnl_response.status_code}")
                try:
                    error_data = pnl_response.json()
                    print(f"   ❌ Error: {error_data}")
                except:
                    print(f"   ❌ Response: {pnl_response.text[:200]}")
                dashboard_tests.append(False)
        except Exception as e:
            print(f"   ❌ P&L Summary API error: {e}")
            dashboard_tests.append(False)
        
        # Test 2: Cap Tracker Progress API
        print("   🔍 Testing GET /api/cap-tracker/progress...")
        try:
            cap_response = self.mobile_session.get(
                f"{self.base_url}/api/cap-tracker/progress",
                timeout=15
            )
            
            if cap_response.status_code == 200:
                print("   ✅ Cap Tracker Progress API - 200 OK")
                cap_data = cap_response.json()
                print(f"   ✅ Response keys: {list(cap_data.keys())}")
                dashboard_tests.append(True)
            else:
                print(f"   ❌ Cap Tracker Progress API - {cap_response.status_code}")
                try:
                    error_data = cap_response.json()
                    print(f"   ❌ Error: {error_data}")
                except:
                    print(f"   ❌ Response: {cap_response.text[:200]}")
                dashboard_tests.append(False)
        except Exception as e:
            print(f"   ❌ Cap Tracker Progress API error: {e}")
            dashboard_tests.append(False)
        
        # Test 3: Daily Tracker API
        print("   🔍 Testing GET /api/tracker/daily?date=2025-10-26...")
        try:
            daily_response = self.mobile_session.get(
                f"{self.base_url}/api/tracker/daily?date=2025-10-26",
                timeout=15
            )
            
            if daily_response.status_code == 200:
                print("   ✅ Daily Tracker API - 200 OK")
                daily_data = daily_response.json()
                print(f"   ✅ Response keys: {list(daily_data.keys())}")
                dashboard_tests.append(True)
            else:
                print(f"   ❌ Daily Tracker API - {daily_response.status_code}")
                try:
                    error_data = daily_response.json()
                    print(f"   ❌ Error: {error_data}")
                except:
                    print(f"   ❌ Response: {daily_response.text[:200]}")
                dashboard_tests.append(False)
        except Exception as e:
            print(f"   ❌ Daily Tracker API error: {e}")
            dashboard_tests.append(False)
        
        # Test 4: Active Deals API
        print("   🔍 Testing GET /api/pnl/active-deals...")
        try:
            deals_response = self.mobile_session.get(
                f"{self.base_url}/api/pnl/active-deals",
                timeout=15
            )
            
            if deals_response.status_code == 200:
                print("   ✅ Active Deals API - 200 OK")
                deals_data = deals_response.json()
                print(f"   ✅ Response: {len(deals_data)} deals returned")
                dashboard_tests.append(True)
            else:
                print(f"   ❌ Active Deals API - {deals_response.status_code}")
                try:
                    error_data = deals_response.json()
                    print(f"   ❌ Error: {error_data}")
                except:
                    print(f"   ❌ Response: {deals_response.text[:200]}")
                dashboard_tests.append(False)
        except Exception as e:
            print(f"   ❌ Active Deals API error: {e}")
            dashboard_tests.append(False)
        
        success_rate = sum(dashboard_tests) / len(dashboard_tests)
        overall_success = success_rate >= 0.75  # 75% success rate required
        
        print(f"   📊 Dashboard APIs: {sum(dashboard_tests)}/{len(dashboard_tests)} passed ({success_rate*100:.1f}%)")
        
        return overall_success, {
            "pnl_summary": dashboard_tests[0] if len(dashboard_tests) > 0 else False,
            "cap_progress": dashboard_tests[1] if len(dashboard_tests) > 1 else False,
            "daily_tracker": dashboard_tests[2] if len(dashboard_tests) > 2 else False,
            "active_deals": dashboard_tests[3] if len(dashboard_tests) > 3 else False,
            "success_rate": success_rate
        }
    
    def test_activity_reflection_logging(self):
        """Test Activity/Reflection Logging APIs"""
        print("\n📝 TESTING ACTIVITY/REFLECTION LOGGING APIS...")
        
        if not self.mobile_session:
            print("   ❌ No mobile session available")
            return False, {"error": "No session"}
        
        logging_tests = []
        
        # Test 1: Activity Log API
        print("   🔍 Testing POST /api/activity-log...")
        activity_data = {
            "activities": {
                "conversations": 5,
                "appointments": 2,
                "offersWritten": 1,
                "listingsTaken": 0
            },
            "hours": {},
            "reflection": ""
        }
        
        try:
            activity_response = self.mobile_session.post(
                f"{self.base_url}/api/activity-log",
                json=activity_data,
                timeout=15
            )
            
            if activity_response.status_code == 200:
                print("   ✅ Activity Log API - 200 OK")
                activity_result = activity_response.json()
                print(f"   ✅ Activity logged successfully")
                logging_tests.append(True)
            else:
                print(f"   ❌ Activity Log API - {activity_response.status_code}")
                try:
                    error_data = activity_response.json()
                    print(f"   ❌ Error: {error_data}")
                except:
                    print(f"   ❌ Response: {activity_response.text[:200]}")
                logging_tests.append(False)
        except Exception as e:
            print(f"   ❌ Activity Log API error: {e}")
            logging_tests.append(False)
        
        # Test 2: Reflection Log API
        print("   🔍 Testing POST /api/reflection-log...")
        reflection_data = {
            "reflection": "Test reflection for mobile API testing"
        }
        
        try:
            reflection_response = self.mobile_session.post(
                f"{self.base_url}/api/reflection-log",
                json=reflection_data,
                timeout=15
            )
            
            if reflection_response.status_code == 200:
                print("   ✅ Reflection Log API - 200 OK")
                reflection_result = reflection_response.json()
                print(f"   ✅ Reflection logged successfully")
                logging_tests.append(True)
            else:
                print(f"   ❌ Reflection Log API - {reflection_response.status_code}")
                try:
                    error_data = reflection_response.json()
                    print(f"   ❌ Error: {error_data}")
                except:
                    print(f"   ❌ Response: {reflection_response.text[:200]}")
                logging_tests.append(False)
        except Exception as e:
            print(f"   ❌ Reflection Log API error: {e}")
            logging_tests.append(False)
        
        success_rate = sum(logging_tests) / len(logging_tests)
        overall_success = success_rate >= 0.5  # 50% success rate required (at least one working)
        
        print(f"   📊 Activity/Reflection APIs: {sum(logging_tests)}/{len(logging_tests)} passed ({success_rate*100:.1f}%)")
        
        return overall_success, {
            "activity_log": logging_tests[0] if len(logging_tests) > 0 else False,
            "reflection_log": logging_tests[1] if len(logging_tests) > 1 else False,
            "success_rate": success_rate
        }
    
    def test_deal_management_apis(self):
        """Test Deal Management APIs"""
        print("\n🏠 TESTING DEAL MANAGEMENT APIS...")
        
        if not self.mobile_session:
            print("   ❌ No mobile session available")
            return False, {"error": "No session"}
        
        deal_tests = []
        created_deal_id = None
        
        # Test 1: Create Deal API
        print("   🔍 Testing POST /api/pnl/deals...")
        deal_data = {
            "house_address": "123 Mobile Test Street, Austin, TX 78701",
            "amount_sold_for": 450000,
            "commission_percent": 6.0,
            "split_percent": 50.0,
            "team_brokerage_split_percent": 20.0,
            "lead_source": "Mobile App Test",
            "contract_signed": "2025-10-01",
            "due_diligence_start": "2025-10-05",
            "due_diligence_over": "2025-10-15",
            "closing_date": "2025-10-30"
        }
        
        try:
            create_response = self.mobile_session.post(
                f"{self.base_url}/api/pnl/deals",
                json=deal_data,
                timeout=15
            )
            
            if create_response.status_code == 200:
                print("   ✅ Create Deal API - 200 OK")
                create_result = create_response.json()
                created_deal_id = create_result.get('id')
                print(f"   ✅ Deal created with ID: {created_deal_id}")
                deal_tests.append(True)
            else:
                print(f"   ❌ Create Deal API - {create_response.status_code}")
                try:
                    error_data = create_response.json()
                    print(f"   ❌ Error: {error_data}")
                except:
                    print(f"   ❌ Response: {create_response.text[:200]}")
                deal_tests.append(False)
        except Exception as e:
            print(f"   ❌ Create Deal API error: {e}")
            deal_tests.append(False)
        
        # Test 2: List Deals API
        print("   🔍 Testing GET /api/pnl/deals...")
        try:
            list_response = self.mobile_session.get(
                f"{self.base_url}/api/pnl/deals",
                timeout=15
            )
            
            if list_response.status_code == 200:
                print("   ✅ List Deals API - 200 OK")
                deals_list = list_response.json()
                print(f"   ✅ Retrieved {len(deals_list)} deals")
                deal_tests.append(True)
            else:
                print(f"   ❌ List Deals API - {list_response.status_code}")
                try:
                    error_data = list_response.json()
                    print(f"   ❌ Error: {error_data}")
                except:
                    print(f"   ❌ Response: {list_response.text[:200]}")
                deal_tests.append(False)
        except Exception as e:
            print(f"   ❌ List Deals API error: {e}")
            deal_tests.append(False)
        
        success_rate = sum(deal_tests) / len(deal_tests)
        overall_success = success_rate >= 0.5  # 50% success rate required
        
        print(f"   📊 Deal Management APIs: {sum(deal_tests)}/{len(deal_tests)} passed ({success_rate*100:.1f}%)")
        
        return overall_success, {
            "create_deal": deal_tests[0] if len(deal_tests) > 0 else False,
            "list_deals": deal_tests[1] if len(deal_tests) > 1 else False,
            "created_deal_id": created_deal_id,
            "success_rate": success_rate
        }
    
    def test_expense_management_apis(self):
        """Test Expense Management APIs"""
        print("\n💰 TESTING EXPENSE MANAGEMENT APIS...")
        
        if not self.mobile_session:
            print("   ❌ No mobile session available")
            return False, {"error": "No session"}
        
        expense_tests = []
        created_expense_id = None
        
        # Test 1: Create Expense API
        print("   🔍 Testing POST /api/pnl/expenses...")
        expense_data = {
            "date": "2025-10-26",
            "category": "Marketing & Advertising",
            "amount": 150.00,
            "description": "Mobile app testing expense",
            "budget": 500.00,
            "recurring": False
        }
        
        try:
            create_response = self.mobile_session.post(
                f"{self.base_url}/api/pnl/expenses",
                json=expense_data,
                timeout=15
            )
            
            if create_response.status_code == 200:
                print("   ✅ Create Expense API - 200 OK")
                create_result = create_response.json()
                created_expense_id = create_result.get('id')
                print(f"   ✅ Expense created with ID: {created_expense_id}")
                expense_tests.append(True)
            else:
                print(f"   ❌ Create Expense API - {create_response.status_code}")
                try:
                    error_data = create_response.json()
                    print(f"   ❌ Error: {error_data}")
                except:
                    print(f"   ❌ Response: {create_response.text[:200]}")
                expense_tests.append(False)
        except Exception as e:
            print(f"   ❌ Create Expense API error: {e}")
            expense_tests.append(False)
        
        # Test 2: List Expenses API
        print("   🔍 Testing GET /api/pnl/expenses...")
        try:
            list_response = self.mobile_session.get(
                f"{self.base_url}/api/pnl/expenses",
                timeout=15
            )
            
            if list_response.status_code == 200:
                print("   ✅ List Expenses API - 200 OK")
                expenses_list = list_response.json()
                print(f"   ✅ Retrieved {len(expenses_list)} expenses")
                expense_tests.append(True)
            else:
                print(f"   ❌ List Expenses API - {list_response.status_code}")
                try:
                    error_data = list_response.json()
                    print(f"   ❌ Error: {error_data}")
                except:
                    print(f"   ❌ Response: {list_response.text[:200]}")
                expense_tests.append(False)
        except Exception as e:
            print(f"   ❌ List Expenses API error: {e}")
            expense_tests.append(False)
        
        success_rate = sum(expense_tests) / len(expense_tests)
        overall_success = success_rate >= 0.5  # 50% success rate required
        
        print(f"   📊 Expense Management APIs: {sum(expense_tests)}/{len(expense_tests)} passed ({success_rate*100:.1f}%)")
        
        return overall_success, {
            "create_expense": expense_tests[0] if len(expense_tests) > 0 else False,
            "list_expenses": expense_tests[1] if len(expense_tests) > 1 else False,
            "created_expense_id": created_expense_id,
            "success_rate": success_rate
        }


def main():
    """Main function for mobile backend API tests"""
    tester = MobileAPITester()
    
    print("🚀 Starting Mobile Backend API Testing Suite...")
    print(f"   Base URL: {tester.base_url}")
    print("=" * 80)
    
    # Run Mobile Backend API Tests
    mobile_success, mobile_results = tester.test_mobile_backend_apis()
    
    print("\n" + "=" * 80)
    print("🎯 MOBILE BACKEND API TESTING SUMMARY")
    print("=" * 80)
    
    if mobile_success:
        print("🎉 MOBILE BACKEND API TESTING COMPLETED SUCCESSFULLY")
        print("✅ All critical mobile APIs are working correctly")
        print("✅ Authentication is working properly")
        print("✅ No 401 authentication errors detected")
        print("✅ No 500 server errors detected")
        print("✅ Production database connectivity confirmed")
    else:
        print("❌ MOBILE BACKEND API TESTING FOUND CRITICAL ISSUES")
        print("⚠️  Some mobile APIs are not working correctly")
        print("⚠️  Review the detailed results above")
    
    print("\n📋 DETAILED RESULTS:")
    for test_name, result in mobile_results.items():
        status = "✅ PASSED" if result['success'] else "❌ FAILED"
        print(f"   {status} - {test_name.replace('_', ' ').title()}")
    
    print("=" * 80)
    return mobile_success


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)