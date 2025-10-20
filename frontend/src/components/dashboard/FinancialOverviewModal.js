import React, { useState } from 'react';
import { 
  X,
  DollarSign,
  Target,
  TrendingUp,
  Calendar,
  Activity,
  HelpCircle,
  Lock,
  AlertTriangle,
  TrendingDown,
  ArrowUp,
  BarChart3
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useNavigate } from 'react-router-dom';

const FinancialOverviewModal = ({ 
  isOpen, 
  onClose, 
  trackerData, 
  capProgress, 
  user 
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Format currency for Action Tracker
  const formatCurrencyAT = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Goals ↔ P&L Overview Component Logic
  const FinancialOverviewContent = () => {
    if (trackerData.loading || !trackerData.settings || !trackerData.summary) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial snapshot...</p>
        </div>
      );
    }

    const { settings, summary, dailyEntry, pnlData } = trackerData;
    const isPro = user?.plan === 'PRO';
    const hasPnL = isPro && pnlData;

    // KPI calculations
    const mtdNet = hasPnL ? pnlData.net_income || 0 : 0;
    const goalPaceGci = summary.goalPaceGciToDate;
    const pnlPaceNet = mtdNet;
    const requiredPerDay = summary.requiredDollarsPerDay;
    
    // Calculate high-value hours and efficiency
    const highValueHours = (dailyEntry?.hours?.prospecting || 0) + 
                          (dailyEntry?.hours?.showings || 0) + 
                          (dailyEntry?.hours?.openHouses || 0);
    const earnedGci = settings.earnedGciToDate || (hasPnL ? pnlData.total_income || 0 : 0);
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
      <>
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

        {/* Triple Progress Bars */}
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
                      onClick={() => {
                        onClose();
                        navigate('/dashboard?tab=captracker');
                      }}
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
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Financial & Activity Overview</h2>
            <p className="text-sm text-gray-600">Your money and productivity at a glance</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <FinancialOverviewContent />
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverviewModal;