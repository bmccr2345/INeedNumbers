#!/usr/bin/env python3
"""
CSRF Protection Fix Testing for Activity Logging
Tests the critical regression fix for CSRF protection that was causing 403 errors
"""

import sys
import os
sys.path.append('/app')

from backend_test import DealPackAPITester

def main_csrf_protection_fix_test():
    """Main function to test CSRF protection fix for activity logging"""
    print("🛡️  CSRF PROTECTION FIX TESTING - CRITICAL REGRESSION FIX")
    print("="*80)
    print("Testing that JWT-authenticated requests bypass CSRF protection")
    print("Focus areas:")
    print("1. POST /api/activity-log with JWT auth (no CSRF token)")
    print("2. POST /api/reflection-log with JWT auth (no CSRF token)")
    print("3. POST /api/pnl/deals with JWT auth (no CSRF token)")
    print("4. Verify no 403 CSRF errors are returned")
    print("5. Confirm dashboard save functionality is restored")
    print("="*80)
    
    tester = DealPackAPITester()
    
    # First authenticate with demo user
    print("\n🔐 AUTHENTICATING WITH DEMO USER...")
    auth_success, auth_response = tester.test_demo_user_login_success()
    
    if not auth_success:
        print("❌ CRITICAL ERROR: Cannot authenticate demo user")
        print("❌ Cannot proceed with CSRF protection fix testing")
        return False
    
    print("✅ Demo user authenticated successfully")
    print(f"✅ JWT Token: {tester.auth_token[:50]}..." if tester.auth_token else "❌ No token")
    
    # Run the CSRF protection fix test
    print("\n🛡️  RUNNING CSRF PROTECTION FIX TEST...")
    csrf_success, csrf_response = tester.test_csrf_protection_fix_activity_logging()
    
    # Also run the regular activity logging test to compare
    print("\n📝 RUNNING REGULAR ACTIVITY LOGGING TEST...")
    try:
        activity_result = tester.test_activity_logging_endpoints()
        if isinstance(activity_result, tuple) and len(activity_result) == 2:
            activity_success, activity_response = activity_result
        else:
            activity_success = True
            activity_response = activity_result
    except Exception as e:
        print(f"   ⚠️  Regular activity logging test error: {e}")
        activity_success = False
        activity_response = {"error": str(e)}
    
    # Summary
    print(f"\n📊 CSRF PROTECTION FIX TEST RESULTS")
    print("="*80)
    print(f"✅ Tests Passed: {tester.tests_passed}")
    print(f"❌ Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"📈 Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if csrf_success:
        print("\n🎉 CSRF PROTECTION FIX VERIFIED SUCCESSFULLY!")
        print("✅ JWT-authenticated requests bypass CSRF protection")
        print("✅ Activity logging endpoints work without 403 CSRF errors")
        print("✅ Dashboard save functionality restored")
        print("✅ User-reported issue resolved")
    else:
        print("\n❌ CSRF PROTECTION FIX FAILED!")
        print("❌ Still getting 403 CSRF errors with JWT authentication")
        print("❌ Dashboard save functionality not restored")
        print("❌ User-reported issue NOT resolved")
        
    return csrf_success

if __name__ == "__main__":
    success = main_csrf_protection_fix_test()
    sys.exit(0 if success else 1)