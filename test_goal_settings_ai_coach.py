#!/usr/bin/env python3

import sys
import os
sys.path.append('/app')

from backend_test import DealPackAPITester

def main():
    """Test Goal Settings and AI Coach functionality as requested in review"""
    print("🎯 GOAL SETTINGS & AI COACH FUNCTIONALITY TEST")
    print("="*80)
    print("Testing the specific issues mentioned in the review request:")
    print("1. Goal Settings were saving to wrong user ID - now fixed to use current demo user ID")
    print("2. AI Coach cache had old format causing validation errors - cleared all cache")
    print("3. Goal Settings frontend was loading from wrong endpoint - now fixed")
    print("="*80)
    
    tester = DealPackAPITester()
    
    # First authenticate with demo user
    print("\n🔐 AUTHENTICATING WITH DEMO USER...")
    login_success = tester.test_demo_user_login_success()
    if not login_success[0]:
        print("❌ Cannot proceed without authentication")
        return False
    
    # Run comprehensive Goal Settings and AI Coach tests
    print("\n🎯 RUNNING COMPREHENSIVE GOAL SETTINGS & AI COACH TESTS...")
    results = tester.test_goal_settings_and_ai_coach_comprehensive()
    
    print("\n" + "="*80)
    print("📊 FINAL TEST RESULTS")
    print("="*80)
    
    if results['overall_success']:
        print("🎉 GOAL SETTINGS & AI COACH TESTS PASSED!")
        print("✅ Goal Settings save/load functionality working correctly")
        print("✅ AI Coach finding goal settings correctly")
        print("✅ Data integration between systems working")
        print("✅ User ID linking fixed and working properly")
        print("✅ Cache format updated and validation errors resolved")
    else:
        print("⚠️  GOAL SETTINGS & AI COACH TESTS FOUND ISSUES")
        print("❌ Some functionality may still need attention")
        
        # Detailed breakdown
        if not results['goal_settings_get'][0]:
            print("❌ Goal Settings retrieval failed")
        if not results['goal_settings_post'][0]:
            print("❌ Goal Settings save functionality failed")
        if not results['goal_settings_persistence'][0]:
            print("❌ Goal Settings persistence failed")
        if not results['ai_coach_generate'][0]:
            print("❌ AI Coach generation failed")
    
    return results['overall_success']

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)