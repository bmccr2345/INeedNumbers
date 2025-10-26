import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  DollarSign, 
  Target, 
  CheckSquare,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  PieChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MobileCard from '../components/mobile/MobileCard';
import QuickActionButton from '../components/mobile/QuickActionButton';
import { Button } from '../components/ui/button';
import MobileActivityModal from '../components/mobile/MobileActivityModal';
import MobileReflectionModal from '../components/mobile/MobileReflectionModal';
import MobileAddDealModal from '../components/mobile/MobileAddDealModal';
import MobileAddExpenseModal from '../components/mobile/MobileAddExpenseModal';
import ProOnboardingWizard from '../components/ProOnboardingWizard';
import { safeLocalStorage } from '../utils/safeStorage';

/**
 * Mobile Dashboard Component
 * Displays stacked cards with key metrics for mobile viewport
 * Phase 3: Full implementation with data fetching
 */
const MobileDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    monthlyNet: null,
    capProgress: null,
    openActions: 0,
    aiCoachMessage: null,
    totalIncome: null,
    totalExpenses: null,
    budgetUtilization: null
  });
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch dashboard data on mount
  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  // Check if PRO user needs onboarding wizard
  useEffect(() => {
    if (user?.plan === 'PRO') {
      const hasCompletedOnboarding = safeLocalStorage.getItem('pro_onboarding_completed');
      const hasDismissed = safeLocalStorage.getItem('pro_onboarding_dismissed');
      
      if (!hasCompletedOnboarding && !hasDismissed) {
        // Show wizard after a brief delay to let dashboard load
        setTimeout(() => {
          setShowOnboardingWizard(true);
        }, 1000);
      }
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      
      // Fetch monthly financial summary (includes net, income, expenses, budget)
      try {
        const financialResponse = await axios.get(
          `${backendUrl}/api/pnl/summary?month=${currentMonth}`,
          { withCredentials: true }
        );
        
        const data = financialResponse.data || {};
        
        // Calculate overall budget utilization percentage
        let totalBudget = 0;
        let totalSpent = 0;
        
        if (data.budget_utilization && typeof data.budget_utilization === 'object') {
          Object.values(data.budget_utilization).forEach((category) => {
            if (category.budget) totalBudget += category.budget;
            if (category.spent) totalSpent += category.spent;
          });
        }
        
        const budgetUtilizationPercent = totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0;
        
        setDashboardData(prev => ({
          ...prev,
          monthlyNet: data.net_income || 0,
          totalIncome: data.total_income || 0,
          totalExpenses: data.total_expenses || 0,
          budgetUtilization: budgetUtilizationPercent
        }));
      } catch (error) {
        console.error('[MobileDashboard] Financial data error:', error);
      }
      
      // Fetch cap tracker progress
      try {
        const capResponse = await axios.get(
          `${backendUrl}/api/cap-tracker/progress`,
          { withCredentials: true }
        );
        
        // Try different field names
        const capValue = capResponse.data?.progress_percentage || 
                        capResponse.data?.progress || 
                        capResponse.data?.percentage ||
                        0;
        
        setDashboardData(prev => ({
          ...prev,
          capProgress: capValue
        }));
      } catch (error) {
        console.error('[MobileDashboard] Cap tracker error:', error);
        console.error('[MobileDashboard] Cap error response:', error.response?.data);
        // Cap might not be configured, that's okay
      }
      
      // Fetch action tracker count - use today's date
      try {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const actionsResponse = await axios.get(
          `${backendUrl}/api/tracker/daily?date=${today}`,
          { withCredentials: true }
        );
        
        // Count incomplete actions from completed object
        const completed = actionsResponse.data?.completed || {};
        const openCount = Object.values(completed).filter(val => !val).length;
        
        setDashboardData(prev => ({
          ...prev,
          openActions: openCount
        }));
      } catch (error) {
        console.error('[MobileDashboard] Actions error:', error);
      }

      setDashboardData(prev => ({
        ...prev,
        aiCoachMessage: null // Will be implemented with AI Coach integration
      }));
    } catch (error) {
      console.error('[MobileDashboard] Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionType) => {
    if (actionType === 'activity') {
      // Show activity modal
      setShowActivityModal(true);
    } else if (actionType === 'reflection') {
      // Show reflection modal
      setShowReflectionModal(true);
    } else if (actionType === 'deal') {
      // Show add deal modal
      setShowAddDealModal(true);
    } else if (actionType === 'expense') {
      // Show add expense modal
      setShowAddExpenseModal(true);
    } else if (actionType === 'onboarding') {
      // Show onboarding wizard
      setShowOnboardingWizard(true);
    } else {
      // Default: just open action tracker
      navigate('/dashboard?openAction=true');
    }
  };

  const handleViewPnL = () => {
    // Navigate to dashboard P&L panel
    navigate('/dashboard?panel=pnl');
  };

  const handleViewCapTracker = () => {
    // Navigate to dashboard cap tracker panel
    navigate('/dashboard?panel=captracker');
  };

  const handleViewActions = () => {
    // Navigate to dashboard action tracker panel
    navigate('/dashboard?panel=actiontracker');
  };

  const handleViewCoach = () => {
    // Navigate to dashboard AI coach
    navigate('/dashboard?panel=coach');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-dashboard p-4 pb-20 space-y-4 bg-gray-50 min-h-full">
      {/* Welcome Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'}!
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Here's your business at a glance
        </p>
      </div>

      {/* This Month's Net Card */}
      <MobileCard
        title="This Month's Net"
        icon={DollarSign}
        onClick={handleViewPnL}
      >
        <div className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(dashboardData.monthlyNet)}
            </span>
            <span className="text-sm text-gray-500">MTD</span>
          </div>
          
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">
              Track your income and expenses
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={(e) => {
              e.stopPropagation();
              handleViewPnL();
            }}
          >
            View Full P&L
          </Button>
        </div>
      </MobileCard>

      {/* Total Income Card */}
      <MobileCard
        title="Total Income"
        icon={TrendingUp}
      >
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-green-700">
              {formatCurrency(dashboardData.totalIncome)}
            </span>
            <span className="text-sm text-gray-500">MTD</span>
          </div>
          <p className="text-sm text-gray-600">
            All commission income this month
          </p>
        </div>
      </MobileCard>

      {/* Total Expenses Card */}
      <MobileCard
        title="Total Expenses"
        icon={TrendingDown}
      >
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-red-700">
              {formatCurrency(dashboardData.totalExpenses)}
            </span>
            <span className="text-sm text-gray-500">MTD</span>
          </div>
          <p className="text-sm text-gray-600">
            All business expenses this month
          </p>
        </div>
      </MobileCard>

      {/* Budget Utilization Card */}
      <MobileCard
        title="Budget Utilization"
        icon={PieChart}
      >
        <div className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {Math.round(dashboardData.budgetUtilization)}%
            </span>
            <span className="text-sm text-gray-500">Used</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                dashboardData.budgetUtilization > 90 
                  ? 'bg-red-500' 
                  : dashboardData.budgetUtilization > 75 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(dashboardData.budgetUtilization, 100)}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-600">
            {dashboardData.budgetUtilization > 90 
              ? '⚠️ Approaching budget limit' 
              : dashboardData.budgetUtilization > 75 
              ? '📊 Monitor spending closely'
              : '✅ Within budget'}
          </p>
        </div>
      </MobileCard>

      {/* Commission Cap Progress Card */}
      <MobileCard
        title="Commission Cap"
        icon={Target}
        badge={`${Math.round(dashboardData.capProgress)}%`}
        onClick={handleViewCapTracker}
      >
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(dashboardData.capProgress, 100)}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-600">
            {Math.round(dashboardData.capProgress) >= 100 
              ? '🎉 Cap reached! Great work!' 
              : `${100 - Math.round(dashboardData.capProgress)}% to cap`}
          </p>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={(e) => {
              e.stopPropagation();
              handleViewCapTracker();
            }}
          >
            Update Cap Progress
          </Button>
        </div>
      </MobileCard>

      {/* Open Actions Card */}
      <MobileCard
        title="Open Actions"
        icon={CheckSquare}
        badge={dashboardData.openActions > 0 ? dashboardData.openActions.toString() : null}
        onClick={handleViewActions}
      >
        <div className="space-y-3">
          {dashboardData.openActions > 0 ? (
            <>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.openActions} {dashboardData.openActions === 1 ? 'action' : 'actions'} pending
              </p>
              <p className="text-sm text-gray-600">
                Stay on top of your follow-ups and tasks
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-900">
                All caught up! 🎉
              </p>
              <p className="text-sm text-gray-600">
                No pending actions. Add a new one to stay productive.
              </p>
            </>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickAction();
            }}
          >
            {dashboardData.openActions > 0 ? 'View Actions' : 'Add Action'}
          </Button>
        </div>
      </MobileCard>

      {/* Quick Calculator Access - FREE/STARTER users */}
      {user?.plan !== 'PRO' && (
        <MobileCard
          title="Need to run numbers?"
          icon={AlertCircle}
          className="bg-blue-50 border-blue-200"
        >
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Access all your real estate calculators quickly
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/tools/commission-split')}
              >
                Commission
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/tools/net-sheet')}
              >
                Net Sheet
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/tools/affordability')}
              >
                Affordability
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/tools/closing-date')}
              >
                Closing Date
              </Button>
            </div>
          </div>
        </MobileCard>
      )}

      {/* Floating Action Button */}
      <QuickActionButton 
        onClick={handleQuickAction} 
        showOnboarding={user?.plan === 'PRO'}
      />

      {/* Activity Modal */}
      <MobileActivityModal 
        isOpen={showActivityModal} 
        onClose={() => setShowActivityModal(false)} 
      />

      {/* Reflection Modal */}
      <MobileReflectionModal 
        isOpen={showReflectionModal} 
        onClose={() => setShowReflectionModal(false)} 
      />

      {/* Add Deal Modal */}
      <MobileAddDealModal 
        isOpen={showAddDealModal} 
        onClose={() => setShowAddDealModal(false)}
        onSuccess={() => fetchDashboardData()} 
      />

      {/* Add Expense Modal */}
      <MobileAddExpenseModal 
        isOpen={showAddExpenseModal} 
        onClose={() => setShowAddExpenseModal(false)}
        onSuccess={() => fetchDashboardData()} 
      />

      {/* Pro Onboarding Wizard */}
      {showOnboardingWizard && (
        <ProOnboardingWizard 
          isOpen={showOnboardingWizard}
          onClose={() => setShowOnboardingWizard(false)}
          onComplete={() => {
            safeLocalStorage.setItem('pro_onboarding_completed', 'true');
            setShowOnboardingWizard(false);
          }}
        />
      )}
    </div>
  );
};

export default MobileDashboard;
