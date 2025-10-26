import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Download, 
  FileSpreadsheet, 
  Calendar,
  Trash2,
  HelpCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Edit3,
  X,
  Check,
  AlertCircle,
  Building,
  Home as HomeIcon,
  Target,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import axios from 'axios';
import Cookies from 'js-cookie';
import PnLAICoach from '../PnLAICoach';

const PnLPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [pnlSummary, setPnlSummary] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [error, setError] = useState(null);
  
  // Inline editing state
  const [editingCell, setEditingCell] = useState(null); // { type: 'deal'|'expense', id: string, field: string }
  const [editValue, setEditValue] = useState('');
  
  // AI Coach state
  const [showAICoach, setShowAICoach] = useState(false);

  // Get backend URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  // Deal form state
  const [newDeal, setNewDeal] = useState({
    house_address: '',
    amount_sold_for: '',
    commission_percent: '',
    split_percent: '',
    team_brokerage_split_percent: '',
    lead_source: '',
    closing_date: ''
  });

  // Expense form state
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    budget: 0,
    amount: '',
    description: '',
    recurring: false
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      loadPnLData();
    }
  }, [selectedMonth]);

  const loadInitialData = async () => {
    try {
      // Use cookie-based authentication - no token needed
      // Load categories and lead sources
      const [categoriesResponse, leadSourcesResponse] = await Promise.all([
        axios.get(`${backendUrl}/api/pnl/categories`).catch(() => ({ data: [] })),
        axios.get(`${backendUrl}/api/pnl/lead-sources`).catch(() => ({ data: [] }))
      ]);

      setExpenseCategories(categoriesResponse.data);
      setLeadSources(leadSourcesResponse.data);
      
      // Load P&L data for current month
      await loadPnLData();
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setError('Failed to load initial data');
    }
  };

  const loadPnLData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${backendUrl}/api/pnl/summary`, {
        params: { month: selectedMonth }
      });

      setPnlSummary(response.data);
    } catch (error) {
      console.error('Failed to load P&L data:', error);
      if (error.response?.status === 402) {
        setError('P&L Tracker requires a Pro plan. Please upgrade to access this feature.');
      } else if (error.response?.status === 401) {
        setError('Authentication required');
      } else {
        setError('Failed to load P&L data');
      }
      setPnlSummary(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Handle add deal
  const handleAddDeal = async (e) => {
    e.preventDefault();
    try {
      const dealData = {
        ...newDeal,
        amount_sold_for: parseFloat(newDeal.amount_sold_for) || 0,
        commission_percent: parseFloat(newDeal.commission_percent) || 0,
        split_percent: parseFloat(newDeal.split_percent) || 0,
        team_brokerage_split_percent: parseFloat(newDeal.team_brokerage_split_percent) || 0
      };

      await axios.post(`${backendUrl}/api/pnl/deals`, dealData);
      
      // Reset form
      setNewDeal({
        house_address: '',
        amount_sold_for: '',
        commission_percent: '',
        split_percent: '',
        team_brokerage_split_percent: '',
        lead_source: '',
        closing_date: ''
      });
      setShowAddDeal(false);
      
      // Reload data
      await loadPnLData();
    } catch (error) {
      console.error('Failed to add deal:', error);
      if (error.response?.status === 401) {
        setError('Authentication required');
      } else {
        setError('Failed to add deal');
      }
    }
  };

  // Handle add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...newExpense,
        amount: parseFloat(newExpense.amount) || 0,
        budget: parseFloat(newExpense.budget) || 0
      };

      await axios.post(`${backendUrl}/api/pnl/expenses`, expenseData);
      
      // Reset form
      setNewExpense({
        date: new Date().toISOString().split('T')[0],
        category: '',
        budget: 0,
        amount: '',
        description: '',
        recurring: false
      });
      setShowAddExpense(false);
      
      // Reload data
      await loadPnLData();
    } catch (error) {
      console.error('Failed to add expense:', error);
      if (error.response?.status === 401) {
        setError('Authentication required');
      } else {
        setError('Failed to add expense');
      }
    }
  };

  // Delete deal
  const deleteDeal = async (dealId) => {
    try {
      await axios.delete(`${backendUrl}/api/pnl/deals/${dealId}`);
      await loadPnLData();
    } catch (error) {
      console.error('Failed to delete deal:', error);
      if (error.response?.status === 401) {
        setError('Authentication required');
      } else {
        setError('Failed to delete deal');
      }
    }
  };

  // Delete expense
  const deleteExpense = async (expenseId) => {
    try {
      await axios.delete(`${backendUrl}/api/pnl/expenses/${expenseId}`);
      await loadPnLData();
    } catch (error) {
      console.error('Failed to delete expense:', error);
      if (error.response?.status === 401) {
        setError('Authentication required');
      } else {
        setError('Failed to delete expense');
      }
    }
  };

  // Generate month options
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    // Generate 12 months: current month and 11 previous months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    
    return options;
  };

  // Handle export to Excel
  const handleExport = async (period = 'month') => {
    try {
      const params = period === 'month' 
        ? { month: selectedMonth } 
        : { year: selectedMonth.split('-')[0] };
      
      const response = await axios.get(`${backendUrl}/api/pnl/export`, {
        params: { ...params, format: 'excel' }
      });
      
      // This would handle the actual Excel download
      console.log('Export response:', response.data);
      alert('Export functionality will be available soon!');
    } catch (error) {
      console.error('Failed to export:', error);
      if (error.response?.status === 401) {
        setError('Authentication required');
      } else {
        setError('Failed to export data');
      }
    }
  };

  // Check if user has Pro access
  const hasProAccess = user?.plan === 'PRO';

  // Generate current month data for AI Coach
  const getCurrentMonthData = () => {
    if (!pnlSummary) return {};
    
    return {
      income: pnlSummary.total_income || 0,
      expenses: pnlSummary.total_expenses || 0,
      net: pnlSummary.net_income || 0,
      incomeCategories: extractIncomeCategories(pnlSummary.deals || []),
      expenseCategories: extractExpenseCategories(pnlSummary.expenses || [])
    };
  };

  // Generate past 6 months data for AI Coach trend analysis
  const getPastSixMonthsData = () => {
    const pastSixMonths = [];
    const currentDate = new Date();
    
    for (let i = 1; i <= 6; i++) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
      
      // This would ideally fetch historical data from API
      // For now, we'll use placeholder data structure
      pastSixMonths.push({
        month: monthKey,
        income: 0, // Would be populated from API call
        expenses: 0,
        net: 0,
        incomeCategories: {},
        expenseCategories: {}
      });
    }
    
    return pastSixMonths;
  };

  // Helper function to extract income categories from deals
  const extractIncomeCategories = (deals) => {
    const categories = {};
    deals.forEach(deal => {
      const category = deal.lead_source || 'Other';
      categories[category] = (categories[category] || 0) + (deal.final_income || 0);
    });
    return categories;
  };

  // Helper function to extract expense categories from expenses
  const extractExpenseCategories = (expenses) => {
    const categories = {};
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      categories[category] = (categories[category] || 0) + (expense.amount || 0);
    });
    return categories;
  };

  // Cap Progress Component
  const CapProgressSection = () => {
    const [capProgress, setCapProgress] = useState(null);
    const [capLoading, setCapLoading] = useState(true);

    useEffect(() => {
      loadCapProgress();
    }, []);

    const loadCapProgress = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/cap-tracker/progress`);
        setCapProgress(response.data);
      } catch (error) {
        // Cap progress is optional, don't show error if not configured
        console.log('Cap progress not available:', error);
      } finally {
        setCapLoading(false);
      }
    };

    if (capLoading || !capProgress) return null;

    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Commission Cap Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Progress</div>
              <div className="text-xl font-bold text-blue-600">{capProgress.percentage?.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Paid</div>
              <div className="text-xl font-bold text-green-600">{formatCurrency(capProgress.paid_so_far)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Remaining</div>
              <div className={`text-xl font-bold ${capProgress.is_complete ? 'text-green-600' : 'text-orange-600'}`}>
                {formatCurrency(capProgress.remaining)}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className={`h-4 rounded-full transition-all duration-300 ${
                capProgress.is_complete ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(capProgress.percentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-600">
            <span>{formatCurrency(capProgress.paid_so_far)} / {formatCurrency(capProgress.total_cap)}</span>
            <span>{capProgress.deals_contributing} deals contributing</span>
          </div>

          {capProgress.is_complete && (
            <div className="mt-3 p-2 bg-green-100 text-green-800 text-sm rounded-lg text-center">
              🎉 Cap Complete! No more cap deductions from future deals.
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Inline editing functions
  const startEditing = (type, id, field, currentValue) => {
    setEditingCell({ type, id, field });
    setEditValue(currentValue.toString());
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editingCell) return;

    try {
      const { type, id, field } = editingCell;
      const newValue = parseFloat(editValue) || 0;

      if (type === 'deal') {
        // Update deal field
        await axios.patch(`${backendUrl}/api/pnl/deals/${id}`, {
          [field]: newValue
        });
      } else if (type === 'expense') {
        // Update expense field
        await axios.patch(`${backendUrl}/api/pnl/expenses/${id}`, {
          [field]: field === 'description' ? editValue : newValue
        });
      }

      // Reload data to show updated values
      await loadPnLData();
      
      // Clear editing state
      setEditingCell(null);
      setEditValue('');
    } catch (error) {
      console.error('Failed to update:', error);
      if (error.response?.status === 401) {
        setError('Authentication required');
      } else {
        setError('Failed to update value');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Agent P&L Tracker
            </h1>
            <p className="text-gray-600 mt-1">
              Track your real estate business income and expenses
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Professional P&L format: Income → Expenses → Net Income
            </p>
          </div>
          
          {hasProAccess && (
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <Button
                onClick={() => setShowAICoach(true)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm"
              >
                <Sparkles className="w-4 h-4 mr-2 text-white" />
                Fairy AI Coach
              </Button>
              <Button
                onClick={() => handleExport('month')}
                variant="outline"
                className="text-sm"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Month
              </Button>
              <Button
                onClick={() => handleExport('year')}
                variant="outline"
                className="text-sm"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Year
              </Button>
            </div>
          )}
        </div>

        {/* Pro Access Check */}
        {!hasProAccess && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-900">Pro Feature Required</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    The P&L Tracker is a Pro-only feature. Upgrade your plan to track deals, expenses, and generate professional reports.
                  </p>
                  <Button 
                    className="mt-3 bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => navigate('/pricing')}
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {hasProAccess && (
          <>
            {/* Month Selector */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div>
                    <Label htmlFor="month">Select Month</Label>
                    <select
                      id="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {generateMonthOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setShowAddDeal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <HomeIcon className="w-4 h-4 mr-2" />
                      Add Deal
                    </Button>
                    <Button
                      onClick={() => setShowAddExpense(true)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Add Expense
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setError(null)}
                      className="ml-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-32"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : pnlSummary ? (
              <>
                {/* P&L Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">Total Income</div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(pnlSummary.total_income)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            From {pnlSummary.deals.length} deal{pnlSummary.deals.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">Total Expenses</div>
                          <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(pnlSummary.total_expenses)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            From {pnlSummary.expenses.length} expense{pnlSummary.expenses.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <TrendingDown className="w-8 h-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">Net Income</div>
                          <div className={`text-2xl font-bold ${
                            pnlSummary.net_income >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(pnlSummary.net_income)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {pnlSummary.net_income >= 0 ? 'Profit' : 'Loss'} for the month
                          </div>
                        </div>
                        <DollarSign className={`w-8 h-8 ${
                          pnlSummary.net_income >= 0 ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Cap Progress Section */}
                <CapProgressSection />

                {/* Income Section (Deals) */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-700">
                        <TrendingUp className="w-5 h-5 inline mr-2" />
                        Income - Closed Deals
                      </CardTitle>
                      <div className="text-sm text-gray-500">
                        Calculate final income: Agent's Gross Commission × (100% - Team/Brokerage Split %)
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {pnlSummary.deals.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="text-left text-sm text-gray-500 border-b">
                              <th className="pb-2">Property Address</th>
                              <th className="pb-2">Sale Price</th>
                              <th className="pb-2">Commission %</th>
                              <th className="pb-2">Split %</th>
                              <th className="pb-2">Team/Brokerage Split %</th>
                              <th className="pb-2">Cap Amount</th>
                              <th className="pb-2">Final Income</th>
                              <th className="pb-2">Lead Source</th>
                              <th className="pb-2">Closing Date</th>
                              <th className="pb-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pnlSummary.deals.map((deal) => (
                              <tr key={deal.id} className="border-b hover:bg-gray-50">
                                <td className="py-2 text-sm font-medium">{deal.house_address}</td>
                                
                                {/* Sale Price - Editable */}
                                <td className="py-2 text-sm">
                                  {editingCell?.type === 'deal' && editingCell?.id === deal.id && editingCell?.field === 'amount_sold_for' ? (
                                    <div className="flex items-center space-x-1">
                                      <Input
                                        type="number"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className="w-24 h-7 text-xs"
                                        autoFocus
                                      />
                                      <button
                                        onClick={saveEdit}
                                        className="text-green-600 hover:text-green-800"
                                        title="Save"
                                      >
                                        <Check className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={cancelEditing}
                                        className="text-red-600 hover:text-red-800"
                                        title="Cancel"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => startEditing('deal', deal.id, 'amount_sold_for', deal.amount_sold_for)}
                                      className="hover:bg-blue-100 px-2 py-1 rounded group flex items-center"
                                      title="Click to edit"
                                    >
                                      <span>{formatCurrency(deal.amount_sold_for)}</span>
                                      <Edit3 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50" />
                                    </button>
                                  )}
                                </td>
                                
                                {/* Commission % - Editable */}
                                <td className="py-2 text-sm">
                                  {editingCell?.type === 'deal' && editingCell?.id === deal.id && editingCell?.field === 'commission_percent' ? (
                                    <div className="flex items-center space-x-1">
                                      <Input
                                        type="number"
                                        step="0.1"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className="w-16 h-7 text-xs"
                                        autoFocus
                                      />
                                      <button onClick={saveEdit} className="text-green-600 hover:text-green-800" title="Save">
                                        <Check className="w-3 h-3" />
                                      </button>
                                      <button onClick={cancelEditing} className="text-red-600 hover:text-red-800" title="Cancel">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => startEditing('deal', deal.id, 'commission_percent', deal.commission_percent)}
                                      className="hover:bg-blue-100 px-2 py-1 rounded group flex items-center"
                                      title="Click to edit"
                                    >
                                      <span>{deal.commission_percent}%</span>
                                      <Edit3 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50" />
                                    </button>
                                  )}
                                </td>
                                
                                {/* Split % - Editable */}
                                <td className="py-2 text-sm">
                                  {editingCell?.type === 'deal' && editingCell?.id === deal.id && editingCell?.field === 'split_percent' ? (
                                    <div className="flex items-center space-x-1">
                                      <Input
                                        type="number"
                                        step="0.1"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className="w-16 h-7 text-xs"
                                        autoFocus
                                      />
                                      <button onClick={saveEdit} className="text-green-600 hover:text-green-800" title="Save">
                                        <Check className="w-3 h-3" />
                                      </button>
                                      <button onClick={cancelEditing} className="text-red-600 hover:text-red-800" title="Cancel">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => startEditing('deal', deal.id, 'split_percent', deal.split_percent)}
                                      className="hover:bg-blue-100 px-2 py-1 rounded group flex items-center"
                                      title="Click to edit"
                                    >
                                      <span>{deal.split_percent}%</span>
                                      <Edit3 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50" />
                                    </button>
                                  )}
                                </td>
                                
                                {/* Team/Brokerage Split % - Editable */}
                                <td className="py-2 text-sm">
                                  {editingCell?.type === 'deal' && editingCell?.id === deal.id && editingCell?.field === 'team_brokerage_split_percent' ? (
                                    <div className="flex items-center space-x-1">
                                      <Input
                                        type="number"
                                        step="0.1"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className="w-16 h-7 text-xs"
                                        autoFocus
                                      />
                                      <button onClick={saveEdit} className="text-green-600 hover:text-green-800" title="Save">
                                        <Check className="w-3 h-3" />
                                      </button>
                                      <button onClick={cancelEditing} className="text-red-600 hover:text-red-800" title="Cancel">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => startEditing('deal', deal.id, 'team_brokerage_split_percent', deal.team_brokerage_split_percent)}
                                      className="hover:bg-blue-100 px-2 py-1 rounded group flex items-center"
                                      title="Click to edit"
                                    >
                                      <span>{deal.team_brokerage_split_percent}%</span>
                                      <Edit3 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50" />
                                    </button>
                                  )}
                                </td>
                                
                                {/* Cap Amount - Display only */}
                                <td className="py-2 text-sm font-medium text-orange-600">
                                  {deal.cap_amount ? formatCurrency(deal.cap_amount) : '—'}
                                </td>
                                
                                {/* Final Income - Calculated, not editable */}
                                <td className="py-2 text-sm font-bold text-green-600">
                                  {formatCurrency(deal.final_income)}
                                </td>
                                
                                <td className="py-2 text-sm">{deal.lead_source}</td>
                                <td className="py-2 text-sm">{new Date(deal.closing_date).toLocaleDateString()}</td>
                                <td className="py-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteDeal(deal.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No deals recorded for this month</p>
                        <Button 
                          onClick={() => setShowAddDeal(true)}
                          className="mt-3 bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Deal
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Expenses Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-red-700">
                        <TrendingDown className="w-5 h-5 inline mr-2" />
                        Expenses - Business Costs
                      </CardTitle>
                      <div className="text-sm text-gray-500">
                        Track all business-related expenses with budget utilization
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {pnlSummary.expenses.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="text-left text-sm text-gray-500 border-b">
                              <th className="pb-2">Date</th>
                              <th className="pb-2">Category</th>
                              <th className="pb-2">Description</th>
                              <th className="pb-2">Amount</th>
                              <th className="pb-2">Budget Utilization</th>
                              <th className="pb-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pnlSummary.expenses.map((expense) => {
                              const utilization = pnlSummary.budget_utilization[expense.category];
                              return (
                                <tr key={expense.id} className="border-b hover:bg-gray-50">
                                  <td className="py-2 text-sm">{new Date(expense.date).toLocaleDateString()}</td>
                                  <td className="py-2 text-sm font-medium">
                                    {expense.category}
                                    {expense.recurring && (
                                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                        Recurring
                                      </span>
                                    )}
                                    {expense.is_recurring_instance && (
                                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                        Auto
                                      </span>
                                    )}
                                  </td>
                                  
                                  {/* Description - Editable */}
                                  <td className="py-2 text-sm">
                                    {editingCell?.type === 'expense' && editingCell?.id === expense.id && editingCell?.field === 'description' ? (
                                      <div className="flex items-center space-x-1">
                                        <Input
                                          type="text"
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          onKeyDown={handleKeyPress}
                                          className="w-32 h-7 text-xs"
                                          autoFocus
                                        />
                                        <button onClick={saveEdit} className="text-green-600 hover:text-green-800" title="Save">
                                          <Check className="w-3 h-3" />
                                        </button>
                                        <button onClick={cancelEditing} className="text-red-600 hover:text-red-800" title="Cancel">
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => startEditing('expense', expense.id, 'description', expense.description || '')}
                                        className="hover:bg-blue-100 px-2 py-1 rounded group flex items-center"
                                        title="Click to edit"
                                      >
                                        <span>{expense.description || '—'}</span>
                                        <Edit3 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50" />
                                      </button>
                                    )}
                                  </td>
                                  
                                  {/* Amount - Editable */}
                                  <td className="py-2 text-sm font-bold text-red-600">
                                    {editingCell?.type === 'expense' && editingCell?.id === expense.id && editingCell?.field === 'amount' ? (
                                      <div className="flex items-center space-x-1">
                                        <Input
                                          type="number"
                                          step="0.01"
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          onKeyDown={handleKeyPress}
                                          className="w-20 h-7 text-xs"
                                          autoFocus
                                        />
                                        <button onClick={saveEdit} className="text-green-600 hover:text-green-800" title="Save">
                                          <Check className="w-3 h-3" />
                                        </button>
                                        <button onClick={cancelEditing} className="text-red-600 hover:text-red-800" title="Cancel">
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => startEditing('expense', expense.id, 'amount', expense.amount)}
                                        className="hover:bg-blue-100 px-2 py-1 rounded group flex items-center"
                                        title="Click to edit"
                                      >
                                        <span>{formatCurrency(expense.amount)}</span>
                                        <Edit3 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50" />
                                      </button>
                                    )}
                                  </td>
                                  <td className="py-2 text-sm">
                                    {utilization ? (
                                      <div className="flex items-center space-x-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                          <div 
                                            className={`h-2 rounded-full ${
                                              utilization.percent > 100 ? 'bg-red-500' : 
                                              utilization.percent > 80 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${Math.min(utilization.percent, 100)}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-xs">
                                          {utilization.percent.toFixed(0)}% of {formatCurrency(utilization.budget)}
                                        </span>
                                      </div>
                                    ) : '—'}
                                  </td>
                                  <td className="py-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteExpense(expense.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No expenses recorded for this month</p>
                        <Button 
                          onClick={() => setShowAddExpense(true)}
                          className="mt-3 bg-red-600 hover:bg-red-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Expense
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Budget Utilization Summary */}
                {Object.keys(pnlSummary.budget_utilization).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Budget Utilization Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(pnlSummary.budget_utilization).map(([category, util]) => (
                          <div key={category} className="border rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Budget:</span>
                                <span className="font-semibold">{formatCurrency(util.budget)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Spent:</span>
                                <span className="font-semibold text-red-600">{formatCurrency(util.spent)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Remaining:</span>
                                <span className={`font-semibold ${util.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(util.remaining)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    util.percent > 100 ? 'bg-red-500' : 
                                    util.percent > 80 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(util.percent, 100)}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 text-center">
                                {util.percent.toFixed(1)}% utilized
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : null}
          </>
        )}

        {/* Add Deal Modal */}
        {showAddDeal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
              <CardHeader>
                <CardTitle>Add New Deal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddDeal} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="house_address">Property Address *</Label>
                      <Input
                        id="house_address"
                        value={newDeal.house_address}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, house_address: e.target.value }))}
                        placeholder="123 Main St, City, State"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="amount_sold_for">Amount Sold For *</Label>
                      <Input
                        id="amount_sold_for"
                        type="number"
                        value={newDeal.amount_sold_for}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, amount_sold_for: e.target.value }))}
                        placeholder="500000"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="commission_percent">Commission % *</Label>
                      <Input
                        id="commission_percent"
                        type="number"
                        step="0.1"
                        value={newDeal.commission_percent}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, commission_percent: e.target.value }))}
                        placeholder="6.0"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="split_percent">Agent's Share % (Default: 100%)</Label>
                      <Input
                        id="split_percent"
                        type="number"
                        step="0.1"
                        value={newDeal.split_percent}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, split_percent: e.target.value }))}
                        placeholder="100.0"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        What % of total commission you receive (leave blank for 100%)
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="team_brokerage_split_percent">Team/Brokerage Split % *</Label>
                      <Input
                        id="team_brokerage_split_percent"
                        type="number"
                        step="0.1"
                        value={newDeal.team_brokerage_split_percent}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, team_brokerage_split_percent: e.target.value }))}
                        placeholder="20.0"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lead_source">Lead Source *</Label>
                      <select
                        id="lead_source"
                        value={newDeal.lead_source}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, lead_source: e.target.value }))}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Select lead source</option>
                        {leadSources.map(source => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="closing_date">Closing Date *</Label>
                      <Input
                        id="closing_date"
                        type="date"
                        value={newDeal.closing_date}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, closing_date: e.target.value }))}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Add Deal
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddDeal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select category</option>
                      {expenseCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="100.00"
                      className="mt-1"
                      required
                    />
                  </div>

                  {/* Recurring Expense Checkbox */}
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={newExpense.recurring}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, recurring: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <Label htmlFor="recurring" className="font-medium text-blue-900 text-base">
                        ✨ Make this expense recurring
                      </Label>
                      <p className="text-sm text-blue-700 mt-1">
                        This expense will automatically appear every month through December {new Date().getFullYear()}. 
                        You'll need to re-check this for expenses starting January 1st of next year.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="budget">Budget (Optional)</Label>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      value={newExpense.budget}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="1000.00"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description..."
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Duplicate removed - now above */}
                  
                  <div className="flex space-x-2 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      Add Expense
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddExpense(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* AI Coach Modal */}
      <PnLAICoach 
        isOpen={showAICoach}
        onClose={() => setShowAICoach(false)}
        currentMonthData={getCurrentMonthData()}
        pastSixMonthsData={getPastSixMonthsData()}
      />
    </div>
  );
};

export default PnLPanel;