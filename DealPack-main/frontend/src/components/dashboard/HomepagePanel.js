import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  DollarSign, 
  Calculator, 
  FileText, 
  BarChart3,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  AlertTriangle,
  Lock,
  ArrowUp,
  Calendar,
  HelpCircle,
  TrendingDown,
  Activity,
  Brain,
  Zap,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { mockDashboardAPI } from '../../services/mockDashboardAPI';
import AICoachBanner from './AICoachBanner';
import ReflectionModal from './ReflectionModal';
import ActivityModal from './ActivityModal';
import axios from 'axios';
import Cookies from 'js-cookie';

const HomepagePanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    mortgage: { count: 0, loading: true },
    commission: { count: 0, loading: true },
    sellerNet: { count: 0, loading: true },
    investorPDFs: { count: 0, loading: true },
    pnlNet: { amount: 0, loading: true }
  });

  // Action Tracker data for Goals ↔ P&L Overview
  const [trackerData, setTrackerData] = useState({
    settings: null,
    dailyEntry: null,
    summary: null,
    pnlData: null,
    loading: true
  });

  // Commission Cap Progress data
  const [capProgress, setCapProgress] = useState({
    data: null,
    loading: true
  });

  // Modal states
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Get backend URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
  
  // Auth helper functions
  const getAuthToken = () => {
    return localStorage.getItem('access_token') || 
           document.cookie.split(';')
             .find(c => c.trim().startsWith('access_token='))
             ?.split('=')[1];
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  };

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  // Load metrics for all tools
  useEffect(() => {
    loadAllMetrics();
    loadTrackerData();
    loadCapProgress();
  }, [user]);

  const loadAllMetrics = async () => {
    try {
      // Load mortgage calculations count
      const mortgageData = await mockDashboardAPI.mortgage.history({ limit: 50 });
      setMetrics(prev => ({ 
        ...prev, 
        mortgage: { count: mortgageData.items.length, loading: false } 
      }));

      // Load commission splits count
      const commissionData = await mockDashboardAPI.commission.history({ limit: 50 });
      setMetrics(prev => ({ 
        ...prev, 
        commission: { count: commissionData.items.length, loading: false } 
      }));

      // Load seller net sheets count
      const netData = await mockDashboardAPI.net.history({ limit: 50 });
      setMetrics(prev => ({ 
        ...prev, 
        sellerNet: { count: netData.items.length, loading: false } 
      }));

      // Load investor PDFs count (Pro only)
      if (user?.plan === 'PRO') {
        const investorData = await mockDashboardAPI.investor.list({ limit: 50 });
        setMetrics(prev => ({ 
          ...prev, 
          investorPDFs: { count: investorData.items.length, loading: false } 
        }));

        // Load P&L net profit (Pro only)
        const pnlData = await mockDashboardAPI.pnl.summary();
        setMetrics(prev => ({ 
          ...prev, 
          pnlNet: { amount: pnlData.kpis.month.net, loading: false } 
        }));
      } else {
        setMetrics(prev => ({ 
          ...prev, 
          investorPDFs: { count: 0, loading: false },
          pnlNet: { amount: 0, loading: false }
        }));
      }

    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
      // Set all to not loading on error
      setMetrics(prev => ({
        mortgage: { count: 0, loading: false },
        commission: { count: 0, loading: false },
        sellerNet: { count: 0, loading: false },
        investorPDFs: { count: 0, loading: false },
        pnlNet: { amount: 0, loading: false }
      }));
    }
  };

  const loadTrackerData = async () => {
    try {
      const currentMonth = getCurrentMonth();
      const today = getTodayDate();

      // Load settings
      const settingsResponse = await axios.get(
        `${backendUrl}/api/tracker/settings?month=${currentMonth}`,
        { headers: getAuthHeaders() }
      );

      // Load daily entry
      const dailyResponse = await axios.get(
        `${backendUrl}/api/tracker/daily?date=${today}`,
        { headers: getAuthHeaders() }
      );

      // Load P&L data if Pro user
      let pnlData = null;
      if (user?.plan === 'PRO') {
        try {
          const pnlResponse = await axios.get(
            `${backendUrl}/api/pnl/summary?month=${currentMonth}&ytd=true`,
            { headers: getAuthHeaders() }
          );
          pnlData = pnlResponse.data;
        } catch (error) {
          console.error('P&L data not available:', error);
        }
      }

      setTrackerData({
        settings: settingsResponse.data,
        dailyEntry: dailyResponse.data.dailyEntry,
        summary: dailyResponse.data.summary,
        pnlData: pnlData,
        loading: false
      });

    } catch (error) {
      console.error('Error loading tracker data:', error);
      setTrackerData(prev => ({ ...prev, loading: false }));
    }
  };

  const loadCapProgress = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        setCapProgress({ data: null, loading: false });
        return;
      }

      const response = await axios.get(`${backendUrl}/api/cap-tracker/progress`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setCapProgress({ data: response.data, loading: false });
    } catch (error) {
      // Cap progress is optional, don't show error if not configured
      console.log('Cap progress not available:', error);
      setCapProgress({ data: null, loading: false });
    }
  };

  // Get user's first name from full name or email
  const getFirstName = () => {
    // First try full_name
    if (user?.full_name && user.full_name.trim()) {
      return user.full_name.split(' ')[0];
    }
    // Then try name (for backward compatibility)
    if (user?.name && user.name.trim()) {
      return user.name.split(' ')[0];
    }
    // Extract from email as fallback
    if (user?.email) {
      const emailPrefix = user.email.split('@')[0];
      // Convert email prefix to a readable name
      const name = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1).replace(/[^a-zA-Z]/g, '');
      return name;
    }
    return 'Agent';
  };

  const formatCurrency = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cents / 100);
  };

  // Format currency for Action Tracker
  const formatCurrencyAT = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Goals ↔ P&L Overview Component
  const GoalsMoneyOverview = () => {
    if (trackerData.loading || !trackerData.settings || !trackerData.summary) {
      return (
        <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your financial snapshot...</p>
          </div>
        </div>
      );
    }

    const { settings, summary, dailyEntry, pnlData } = trackerData;
    const isPro = user?.plan === 'PRO';
    const hasPnL = isPro && pnlData;

    // KPI calculations
    const mtdNet = hasPnL ? pnlData.kpis?.month?.net || 0 : 0;
    const goalPaceGci = summary.goalPaceGciToDate;
    const pnlPaceNet = mtdNet;
    const requiredPerDay = summary.requiredDollarsPerDay;
    
    // Calculate high-value hours and efficiency
    const highValueHours = (dailyEntry?.hours?.prospecting || 0) + 
                          (dailyEntry?.hours?.showings || 0) + 
                          (dailyEntry?.hours?.openHouses || 0);
    const earnedGci = settings.earnedGciToDate || (hasPnL ? pnlData.kpis?.month?.income || 0 : 0);
    const dollarsPerHour = highValueHours > 0 ? earnedGci / highValueHours : 0;

    // Enhanced KPI definitions for tooltips
    const kpiDefinitions = {
      profitThisMonth: {
        title: "Profit This Month",
        calculation: "Total Income - Total Expenses",
        whyCare: "Shows your actual take-home profit after all business costs. This is what you're really earning.",
        icon: <DollarSign className="w-5 h-5 text-emerald-600 mr-1" />
      },
      shouldHaveEarned: {
        title: "Should Have Earned",
        calculation: "Monthly Goal × (Days Worked ÷ Total Work Days)",
        whyCare: "Where you should be by today to hit your monthly goal. Helps you stay on track.",
        icon: <Target className="w-5 h-5 text-blue-600 mr-1" />
      },
      actuallyEarned: {
        title: "Actually Earned", 
        calculation: "Total commissions received this month",
        whyCare: "Your real income so far. Compare to 'Should Have Earned' to see if you're ahead or behind.",
        icon: <TrendingUp className="w-5 h-5 text-green-600 mr-1" />
      },
      dailyTarget: {
        title: "Daily Target",
        calculation: "(Monthly Goal - Earned So Far) ÷ Remaining Work Days",
        whyCare: "How much you need to earn each remaining day to hit your monthly goal. Your daily focus number.",
        icon: <Calendar className="w-5 h-5 text-orange-600 mr-1" />
      },
      hourlyEfficiency: {
        title: "Hourly Efficiency",
        calculation: "Total Earnings ÷ High-Value Hours (prospecting, showings, open houses)",
        whyCare: "Shows how much money you make per productive hour. Higher = more efficient business.",
        icon: <Activity className="w-5 h-5 text-purple-600 mr-1" />
      }
    };

    // Tooltip component
    const KPITooltip = ({ definition, children }) => {
      const [showTooltip, setShowTooltip] = useState(false);
      
      return (
        <div className="relative">
          <div 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="cursor-help"
          >
            {children}
          </div>
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
              <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-xs text-sm">
                <div className="font-semibold mb-2">{definition.title}</div>
                <div className="mb-2">
                  <span className="font-medium">Calculation:</span><br />
                  {definition.calculation}
                </div>
                <div>
                  <span className="font-medium">Why it matters:</span><br />
                  {definition.whyCare}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>
      );
    };

    // Insight chips with better messaging
    const insights = [];
    if (earnedGci < goalPaceGci) {
      const gap = goalPaceGci - earnedGci;
      insights.push({
        text: `${formatCurrencyAT(gap)} behind goal`,
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <TrendingDown className="w-4 h-4" />
      });
    } else if (earnedGci > goalPaceGci) {
      const ahead = earnedGci - goalPaceGci;
      insights.push({
        text: `${formatCurrencyAT(ahead)} ahead of goal`,
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <TrendingUp className="w-4 h-4" />
      });
    }

    if (hasPnL && pnlData.kpis?.month?.expenses && pnlData.kpis?.month?.income) {
      const expenseRate = (pnlData.kpis.month.expenses / Math.max(pnlData.kpis.month.income, 1)) * 100;
      insights.push({
        text: `${expenseRate.toFixed(0)}% expense ratio`,
        color: expenseRate > 60 ? 'bg-red-100 text-red-800 border-red-200' : 
               expenseRate > 40 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
               'bg-green-100 text-green-800 border-green-200',
        icon: <BarChart3 className="w-4 h-4" />
      });
    }

    // Find bottleneck activity
    if (summary.gaps) {
      let maxGap = 0;
      let bottleneckActivity = '';
      Object.entries(summary.gaps).forEach(([activity, gap]) => {
        if (gap > maxGap) {
          maxGap = gap;
          bottleneckActivity = activity;
        }
      });
      
      if (bottleneckActivity && maxGap > 0) {
        const formatActivityName = (activity) => {
          return activity.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        };
        insights.push({
          text: `Focus: ${formatActivityName(bottleneckActivity)}`,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <AlertTriangle className="w-4 h-4" />
        });
      }
    }

    if (!isPro) {
      insights.push({
        text: 'Upgrade for full financial tracking',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Lock className="w-4 h-4" />,
        isUpgrade: true
      });
    }

    return (
      <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial & Activity Overview</h3>
          <p className="text-sm text-gray-600">Your money and productivity at a glance</p>
        </div>

        {/* KPI Band */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {/* Profit This Month */}
          <KPITooltip definition={kpiDefinitions.profitThisMonth}>
            <Card className={`transition-all hover:shadow-md ${!hasPnL ? 'opacity-50' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {kpiDefinitions.profitThisMonth.icon}
                  {!hasPnL && <Lock className="w-4 h-4 text-gray-400 ml-1" />}
                  <HelpCircle className="w-3 h-3 text-gray-400 ml-1" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrencyAT(mtdNet)}
                </div>
                <div className="text-xs text-gray-600">Profit This Month</div>
                <div className="text-xs text-gray-500">after all expenses</div>
              </CardContent>
            </Card>
          </KPITooltip>

          {/* Should Have Earned */}
          <KPITooltip definition={kpiDefinitions.shouldHaveEarned}>
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {kpiDefinitions.shouldHaveEarned.icon}
                  <HelpCircle className="w-3 h-3 text-gray-400 ml-1" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrencyAT(goalPaceGci)}
                </div>
                <div className="text-xs text-gray-600">Should Have Earned</div>
                <div className="text-xs text-gray-500">by today</div>
              </CardContent>
            </Card>
          </KPITooltip>

          {/* Actually Earned */}
          <KPITooltip definition={kpiDefinitions.actuallyEarned}>
            <Card className={`transition-all hover:shadow-md ${!hasPnL ? 'opacity-50' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {kpiDefinitions.actuallyEarned.icon}
                  {!hasPnL && <Lock className="w-4 h-4 text-gray-400 ml-1" />}
                  <HelpCircle className="w-3 h-3 text-gray-400 ml-1" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrencyAT(earnedGci)}
                </div>
                <div className="text-xs text-gray-600">Actually Earned</div>
                <div className="text-xs text-gray-500">total so far</div>
              </CardContent>
            </Card>
          </KPITooltip>

          {/* Daily Target */}
          <KPITooltip definition={kpiDefinitions.dailyTarget}>
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {kpiDefinitions.dailyTarget.icon}
                  <HelpCircle className="w-3 h-3 text-gray-400 ml-1" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrencyAT(requiredPerDay)}
                </div>
                <div className="text-xs text-gray-600">Daily Target</div>
                <div className="text-xs text-gray-500">to hit monthly goal</div>
              </CardContent>
            </Card>
          </KPITooltip>

          {/* Hourly Efficiency */}
          <KPITooltip definition={kpiDefinitions.hourlyEfficiency}>
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {kpiDefinitions.hourlyEfficiency.icon}
                  <HelpCircle className="w-3 h-3 text-gray-400 ml-1" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrencyAT(dollarsPerHour)}
                </div>
                <div className="text-xs text-gray-600">Hourly Efficiency</div>
                <div className="text-xs text-gray-500">per productive hour</div>
              </CardContent>
            </Card>
          </KPITooltip>
        </div>

        {/* Triple Progress Bars with better labels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Activity Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <h4 className="font-medium text-gray-900">Activity Progress</h4>
                <p className="text-sm text-gray-600">How your daily actions are converting to closings</p>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(summary.activityProgress * 100, 100)}%` }}
                  />
                </div>
                <div className="text-center mt-2 text-sm font-medium">
                  {(summary.activityProgress * 100).toFixed(0)}% to goal
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Money Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <h4 className="font-medium text-gray-900">Money Progress</h4>
                <p className="text-sm text-gray-600">How close you are to your monthly income goal</p>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(summary.progress * 100, 100)}%` }}
                  />
                </div>
                <div className="text-center mt-2 text-sm font-medium">
                  {(summary.progress * 100).toFixed(0)}% to goal
                </div>
                {/* Expense breakdown for Pro */}
                {hasPnL && pnlData.kpis?.month?.income && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-l-full"
                        style={{ 
                          width: `${Math.min((pnlData.kpis.month.income / (pnlData.kpis.month.income + pnlData.kpis.month.expenses)) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Keep</span>
                      <span>Spend</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Commission Cap Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <h4 className="font-medium text-gray-900">Commission Cap Progress</h4>
                <p className="text-sm text-gray-600">How much of your annual cap you've paid</p>
              </div>
              <div className="relative">
                {capProgress.loading ? (
                  <div className="w-full bg-gray-200 rounded-full h-6 animate-pulse"></div>
                ) : capProgress.data ? (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div 
                        className={`h-6 rounded-full transition-all duration-500 ${
                          capProgress.data.is_complete 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gradient-to-r from-orange-500 to-orange-600'
                        }`}
                        style={{ width: `${Math.min(capProgress.data.percentage || 0, 100)}%` }}
                      />
                    </div>
                    <div className="text-center mt-2 text-sm font-medium">
                      {capProgress.data.is_complete ? (
                        <span className="text-green-600">Cap Complete! 🎉</span>
                      ) : (
                        `${(capProgress.data.percentage || 0).toFixed(0)}% to cap`
                      )}
                    </div>
                    <div className="text-center mt-1 text-xs text-gray-500">
                      ${Math.round(capProgress.data.paid_so_far || 0).toLocaleString()} of ${Math.round(capProgress.data.total_cap || 0).toLocaleString()}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No cap configured</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => navigate('/dashboard?tab=captracker')}
                      className="text-xs p-0 h-auto"
                    >
                      Set up cap tracking
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insight Chips */}
        <div className="flex flex-wrap gap-2">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`${insight.color} border flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${insight.isUpgrade ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={insight.isUpgrade ? () => window.open('/pricing', '_blank') : undefined}
            >
              {insight.icon}
              <span>{insight.text}</span>
              {insight.isUpgrade && <ArrowUp className="w-3 h-3 ml-1" />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MetricCard = ({ icon: Icon, title, metric, subtext, loading, ctaText, onClick, isPro = false }) => (
    <Card className={`${isPro && user?.plan !== 'PRO' ? 'opacity-60' : ''} hover:shadow-md transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          ) : (
            <div className="text-3xl font-bold text-gray-900">
              {metric}
            </div>
          )}
          <p className="text-sm text-gray-500">
            {subtext}
          </p>
          <Button 
            size="sm"
            onClick={onClick}
            disabled={isPro && user?.plan !== 'PRO'}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Removed Welcome Header Section */}

        {/* AI Coach Promotional Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-3 mr-4">
                  <div className="relative">
                    <Brain className="w-7 h-7 text-purple-600" />
                    <Sparkles className="w-3 h-3 absolute -top-0.5 -right-0.5 text-pink-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">✨ Your Fairy AI Coach is Ready!</h2>
                  <div className="flex items-center text-sm text-purple-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-medium">Live & Learning from Your Data</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Get personalized insights from your dedicated Fairy AI Coach that analyzes your goals, activities, and performance 24/7. 
                Never miss opportunities or lose momentum again! Your magical coach tracks every conversation, identifies patterns, 
                and gives you strategic advice to hit your targets faster.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center mb-2">
                    <div className="bg-emerald-100 rounded-full p-2 mr-3">
                      <Target className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-sm text-gray-900">Smart Goal Tracking</span>
                  </div>
                  <p className="text-xs text-gray-600">Analyzes your progress and identifies exactly what activities to focus on</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-sm text-gray-900">Pattern Recognition</span>
                  </div>
                  <p className="text-xs text-gray-600">Spots what's working in your business and scales successful activities</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center mb-2">
                    <div className="bg-purple-100 rounded-full p-2 mr-3">
                      <Zap className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-semibold text-sm text-gray-900">Daily Action Plans</span>
                  </div>
                  <p className="text-xs text-gray-600">Provides specific daily recommendations to maximize your productivity</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="flex items-center mr-6">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span>Updated with Every Activity Log</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                    <span>Powered by OpenAI GPT</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block ml-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-full p-6">
                <div className="relative">
                  <Brain className="w-20 h-20 text-purple-600" />
                  <Sparkles className="w-6 h-6 absolute -top-1 -right-1 text-pink-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Coach Action Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <Button
            onClick={async () => {
              try {
                const { fetchCoachJSON } = await import('../../lib/coach.js');
                await fetchCoachJSON(true); // Force refresh
                window.location.reload(); // Refresh to show updated data
              } catch (error) {
                console.error('Failed to refresh AI Coach:', error);
                window.location.reload(); // Fallback to simple refresh
              }
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
          >
            <div className="relative inline-block mr-2">
              <Brain className="w-4 h-4" />
              <Sparkles className="w-2 h-2 absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>
            Refresh Fairy AI Coach
          </Button>
          
          <Button
            onClick={() => setIsActivityModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
          >
            <Activity className="w-4 h-4 mr-2" />
            Log Activity
          </Button>
          
          <Button
            onClick={() => setIsReflectionModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Log a Reflection
          </Button>
        </div>

        {/* AI Coach Banner */}
        <AICoachBanner />

        {/* Goals ↔ P&L Overview - PRO users only */}
        {user?.plan === 'PRO' && <GoalsMoneyOverview />}

        {/* Tool Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Mortgage Calculator Card */}
          <MetricCard
            icon={Home}
            title="Mortgage Calculator"
            metric={metrics.mortgage.count}
            subtext={metrics.mortgage.count === 0 ? "No calculations yet" : "Recent Calculations"}
            loading={metrics.mortgage.loading}
            ctaText="Go to Mortgage Tool"
            onClick={() => navigate('/dashboard?tab=mortgage')}
          />

          {/* Commission Split Card */}
          <MetricCard
            icon={DollarSign}
            title="Commission Split"
            metric={metrics.commission.count}
            subtext={metrics.commission.count === 0 ? "No splits yet" : "Recent Splits"}
            loading={metrics.commission.loading}
            ctaText="Go to Commission Tool"
            onClick={() => navigate('/dashboard?tab=commission')}
          />

          {/* Seller Net Sheet Card */}
          <MetricCard
            icon={Calculator}
            title="Seller Net Sheet"
            metric={metrics.sellerNet.count}
            subtext={metrics.sellerNet.count === 0 ? "No estimates yet" : "Recent Estimates"}
            loading={metrics.sellerNet.loading}
            ctaText="Go to Net Sheet Tool"
            onClick={() => navigate('/dashboard?tab=sellernet')}
          />

          {/* Investor PDFs Card (Pro only) */}
          <MetricCard
            icon={FileText}
            title="Investor Deal PDFs"
            metric={metrics.investorPDFs.count}
            subtext={
              user?.plan !== 'PRO' 
                ? "Upgrade to Pro" 
                : metrics.investorPDFs.count === 0 
                  ? "No PDFs created yet" 
                  : "Investor Packets"
            }
            loading={metrics.investorPDFs.loading}
            ctaText={user?.plan !== 'PRO' ? "Upgrade to Pro" : "Go to Investor Tool"}
            onClick={() => {
              if (user?.plan !== 'PRO') {
                navigate('/pricing');
              } else {
                navigate('/dashboard?tab=investor');
              }
            }}
            isPro={true}
          />

          {/* P&L Tracker Card (Pro only) */}
          <MetricCard
            icon={BarChart3}
            title="Agent P&L Tracker"
            metric={
              user?.plan !== 'PRO' 
                ? "Pro Only" 
                : metrics.pnlNet.amount === 0 
                  ? "$0" 
                  : formatCurrency(metrics.pnlNet.amount)
            }
            subtext={
              user?.plan !== 'PRO' 
                ? "Upgrade to Pro" 
                : metrics.pnlNet.amount === 0 
                  ? "No transactions yet" 
                  : "Monthly Net Profit"
            }
            loading={metrics.pnlNet.loading && user?.plan === 'PRO'}
            ctaText={user?.plan !== 'PRO' ? "Upgrade to Pro" : "Go to P&L Tool"}
            onClick={() => {
              if (user?.plan !== 'PRO') {
                navigate('/pricing');
              } else {
                navigate('/dashboard?tab=pnl');
              }
            }}
            isPro={true}
          />

          {/* Quick Action Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Quick Actions
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-lg font-semibold text-gray-900">
                  Get Started
                </div>
                <p className="text-sm text-gray-600">
                  Run your first calculation or create an investor packet
                </p>
                <div className="space-y-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/calculator')}
                    className="w-full"
                  >
                    Free Calculator
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/tools')}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
                  >
                    Browse All Tools
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Need Help Getting Started?
              </h3>
              <p className="text-gray-600">
                Check out our support center or browse all available tools.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => navigate('/support')}>
                Support Center
              </Button>
              <Button 
                onClick={() => navigate('/tools')}
                className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
              >
                All Tools
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onActivitySaved={() => {
          // Optionally refresh any data that depends on activities
          console.log('Activity saved successfully');
        }}
      />

      {/* Reflection Modal */}
      <ReflectionModal
        isOpen={isReflectionModalOpen}
        onClose={() => setIsReflectionModalOpen(false)}
        onReflectionSaved={() => {
          // Optionally refresh any data that depends on reflections
          console.log('Reflection saved successfully');
        }}
      />
    </div>
  );
};

export default HomepagePanel;