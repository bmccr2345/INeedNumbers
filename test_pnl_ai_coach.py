#!/usr/bin/env python3
"""
P&L AI Coach Integration Test Runner
Tests the new P&L analysis context functionality
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from backend_test import DealPackAPITester

def main():
    """Run P&L AI Coach integration tests"""
    print("🚀 STARTING P&L AI COACH INTEGRATION TESTS...")
    print("=" * 80)
    
    tester = DealPackAPITester()
    
    # First, authenticate with demo user
    print("\n🔐 AUTHENTICATING WITH DEMO USER...")
    auth_success, auth_response = tester.test_demo_user_login_success()
    
    if not auth_success:
        print("❌ CRITICAL: Cannot authenticate demo user - P&L AI Coach tests require authentication")
        print("   Please ensure demo@demo.com user exists with password 'demo123' and PRO plan")
        return False
    
    print("✅ Authentication successful - proceeding with P&L AI Coach tests")
    
    # Run P&L AI Coach integration tests
    print("\n" + "=" * 80)
    print("🤖💰 RUNNING P&L AI COACH INTEGRATION TESTS...")
    print("=" * 80)
    
    overall_success, results = tester.test_pnl_ai_coach_integration()
    
    # Print detailed results
    print("\n" + "=" * 80)
    print("📊 DETAILED TEST RESULTS:")
    print("=" * 80)
    
    for test_name, test_result in results.items():
        success = test_result['success']
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {test_name.replace('_', ' ').title()}")
        
        # Print key findings for each test
        response = test_result.get('response', {})
        if isinstance(response, dict):
            if 'summary' in response:
                print(f"   Summary: {response['summary'][:100]}...")
            if 'actions' in response and response['actions']:
                print(f"   Actions: {len(response['actions'])} recommendations")
            if 'error' in response:
                print(f"   Error: {response['error']}")
    
    # Final assessment
    print("\n" + "=" * 80)
    print("🎯 FINAL ASSESSMENT:")
    print("=" * 80)
    
    if overall_success:
        print("🎉 P&L AI COACH INTEGRATION - ALL TESTS PASSED!")
        print("✅ New pnl_analysis context is working correctly")
        print("✅ P&L data structure processing is functional")
        print("✅ Specialized financial analysis prompt is active")
        print("✅ Fallback responses work for empty data")
        print("✅ Authentication and rate limiting are enforced")
        print("\n🚀 P&L AI Coach is ready for production use!")
    else:
        print("⚠️  P&L AI COACH INTEGRATION - SOME ISSUES FOUND")
        print("   Review the detailed results above for specific failures")
        print("   Most functionality may still be working correctly")
    
    return overall_success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)