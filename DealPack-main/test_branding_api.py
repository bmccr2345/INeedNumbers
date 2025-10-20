#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend_test import DealPackAPITester

def main():
    print("🎨 BRANDING PROFILE API COMPREHENSIVE TESTING")
    print("=" * 80)
    print("TESTING: Branding Profile API system implementation (Phase 1)")
    print("FOCUS: GET/POST /api/brand/profile, POST /api/brand/upload, DELETE /api/brand/asset, GET /api/brand/resolve")
    print("CONTEXT: S3 credentials are placeholder values - uploads will show warning but API structure should work")
    print("=" * 80)
    
    # Initialize tester
    tester = DealPackAPITester()
    
    # First, try to get authentication for testing
    print("\n🔐 AUTHENTICATION SETUP...")
    
    # Try demo credentials first
    demo_login_data = {
        "email": "demo@demo.com",
        "password": "demo123",
        "remember_me": False
    }
    
    demo_success, demo_response = tester.run_test(
        "Authentication Setup (Demo User)",
        "POST",
        "api/auth/login",
        200,
        data=demo_login_data,
        auth_required=False
    )
    
    if demo_success and isinstance(demo_response, dict) and 'access_token' in demo_response:
        tester.auth_token = demo_response.get('access_token')
        user_info = demo_response.get('user', {})
        print(f"   ✅ Authenticated as: {user_info.get('email')}")
        print(f"   ✅ User Plan: {user_info.get('plan')}")
    else:
        # Try master admin credentials
        admin_login_data = {
            "email": "bmccr23@gmail.com",
            "password": "Goosey23!!32",
            "remember_me": False
        }
        
        admin_success, admin_response = tester.run_test(
            "Authentication Setup (Master Admin)",
            "POST",
            "api/auth/login",
            200,
            data=admin_login_data,
            auth_required=False
        )
        
        if admin_success and isinstance(admin_response, dict) and 'access_token' in admin_response:
            tester.auth_token = admin_response.get('access_token')
            user_info = admin_response.get('user', {})
            print(f"   ✅ Authenticated as: {user_info.get('email')}")
            print(f"   ✅ User Plan: {user_info.get('plan')}")
            print(f"   ✅ User Role: {user_info.get('role')}")
        else:
            print("   ⚠️  Could not authenticate - testing with limited access")
    
    # Run the comprehensive branding API tests
    results = tester.test_branding_profile_api_comprehensive()
    
    # Print final results
    print(f"\n📊 BRANDING PROFILE API TESTING RESULTS")
    print("=" * 70)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    # Analysis
    failed_tests = tester.tests_run - tester.tests_passed
    
    if failed_tests == 0:
        print("\n🎉 ALL BRANDING PROFILE API TESTS PASSED!")
        print("✅ The Branding Profile API system is working correctly")
        print("✅ Authentication requirements are enforced")
        print("✅ Plan-based feature gating is working")
        print("✅ Data validation and error handling is working")
        print("✅ Profile creation and updates are working")
        print("✅ Brand data resolution for PDF generation is working")
    else:
        print(f"\n⚠️  {failed_tests} tests failed")
        print("❌ Some branding API endpoints may have issues")
        print("🔍 Check the detailed test output above for specific failures")
    
    return tester.tests_passed == tester.tests_run

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)