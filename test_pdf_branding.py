#!/usr/bin/env python3
"""
PDF Branding Integration Test Script
Tests the updated PDF branding integration as requested in the review.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend_test import DealPackAPITester

def main():
    print("🎨 PDF BRANDING INTEGRATION TESTING")
    print("=" * 80)
    print("TESTING: Updated PDF branding integration")
    print("FOCUS: Branding data fetching, merging, agent/brokerage info in headers")
    print("SCOPE: Both PDF generation and preview endpoints with branding integration")
    print("=" * 80)
    
    # Initialize tester
    tester = DealPackAPITester()
    
    # First, authenticate with demo user
    print("\n🔐 AUTHENTICATION SETUP...")
    
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
        print("   ❌ Could not authenticate with demo user")
        print("   ⚠️  PDF branding tests require authentication")
        return
    
    # Run PDF Branding Integration Tests
    print("\n" + "=" * 80)
    print("COMPREHENSIVE PDF BRANDING INTEGRATION TESTS")
    print("=" * 80)
    
    # Test 1: Comprehensive PDF Branding Integration
    results1 = tester.test_pdf_branding_integration_comprehensive()
    
    # Test 2: User Scenarios (with/without profiles)
    results2 = tester.test_pdf_branding_user_scenarios()
    
    # Final Summary
    print("\n" + "=" * 80)
    print("PDF BRANDING INTEGRATION TEST SUMMARY")
    print("=" * 80)
    
    # Count total tests
    total_tests = 0
    passed_tests = 0
    
    # Count from comprehensive tests
    if isinstance(results1, dict):
        total_tests += len(results1)
        passed_tests += sum(1 for success, _ in results1.values() if success)
    
    # Count from user scenario tests
    if isinstance(results2, dict):
        total_tests += len(results2)
        passed_tests += sum(1 for success, _ in results2.values() if success)
    
    print(f"✅ Tests Passed: {passed_tests}")
    print(f"❌ Tests Failed: {total_tests - passed_tests}")
    print(f"📈 Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    
    if passed_tests == total_tests:
        print("🎉 ALL PDF BRANDING INTEGRATION TESTS PASSED!")
        print("\n✅ VERIFICATION COMPLETE:")
        print("   ✅ Branding data is correctly fetched and merged into PDF report data")
        print("   ✅ Agent information (name, initials, email, phone) appears in header")
        print("   ✅ Brokerage information (name, license) appears in header")
        print("   ✅ PDF template renders branding variables correctly")
        print("   ✅ Users with branding profiles show personalized information")
        print("   ✅ Users without branding profiles show generic information")
        print("   ✅ Both PDF generation and preview endpoints work with branding")
    else:
        print("⚠️  Some PDF branding integration tests failed")
        print("   Please review the detailed test results above")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()