import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ExternalLink, Trash2, Eye, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { mockDashboardAPI, formatCurrency, formatDate } from '../../services/mockDashboardAPI';

const MortgagePanel = () => {
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showTooltip, setShowTooltip] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    loanAmount: '',
    rate: '',
    termYears: '30',
    income: '',
    taxesInsurance: ''
  });

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await mockDashboardAPI.mortgage.history({ limit: 3 });
      setHistory(response.items);
    } catch (error) {
      console.error('Failed to load mortgage history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = async () => {
    // Validation
    if (!formData.loanAmount || !formData.rate || !formData.termYears) {
      alert('Please fill in Loan Amount, Interest Rate, and Term.');
      return;
    }

    try {
      setIsCalculating(true);
      
      const data = {
        loanAmount: parseFloat(formData.loanAmount),
        rate: parseFloat(formData.rate),
        termYears: parseInt(formData.termYears),
        income: formData.income ? parseFloat(formData.income) : null,
        taxesInsurance: formData.taxesInsurance ? parseFloat(formData.taxesInsurance) : null
      };

      const response = await mockDashboardAPI.mortgage.calc(data);
      setResult(response);

      // Analytics event
      if (window.gtag) {
        window.gtag('event', 'mortgage_calculation', {
          loan_amount: data.loanAmount,
          rate: data.rate,
          term: data.termYears
        });
      }

    } catch (error) {
      console.error('Calculation failed:', error);
      alert('Calculation failed. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this calculation?')) return;
    
    try {
      await mockDashboardAPI.mortgage.delete(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50';
      toast.textContent = 'Calculation deleted.';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const tooltips = {
    loanAmount: "Total mortgage principal amount.",
    rate: "Annual interest rate (APR).",
    termYears: "Loan length in years.",
    income: "Optional. Used to estimate debt-to-income ratio.",
    taxesInsurance: "Optional monthly property taxes and insurance."
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Mortgage & Affordability Calculator
            </h1>
            <p className="text-gray-600 mt-1">
              Show clients what they can afford in seconds.
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate('/tools/affordability')}
            className="mt-4 sm:mt-0 flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Go to Full Calculator</span>
          </Button>
        </div>

        {/* Quick Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Quick Calculation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              
              {/* Loan Amount */}
              <div className="relative">
                <Label htmlFor="loanAmount" className="flex items-center space-x-1">
                  <span>Loan Amount</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('loanAmount')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="250000"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'loanAmount' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.loanAmount}
                  </div>
                )}
              </div>

              {/* Interest Rate */}
              <div className="relative">
                <Label htmlFor="rate" className="flex items-center space-x-1">
                  <span>Interest Rate (APR)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('rate')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.1"
                  placeholder="6.5"
                  value={formData.rate}
                  onChange={(e) => handleInputChange('rate', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'rate' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.rate}
                  </div>
                )}
              </div>

              {/* Term */}
              <div className="relative">
                <Label htmlFor="termYears" className="flex items-center space-x-1">
                  <span>Term (years)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('termYears')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <select
                  id="termYears"
                  value={formData.termYears}
                  onChange={(e) => handleInputChange('termYears', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="25">25 years</option>
                  <option value="30">30 years</option>
                </select>
                {showTooltip === 'termYears' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.termYears}
                  </div>
                )}
              </div>

              {/* Gross Income (Optional) */}
              <div className="relative">
                <Label htmlFor="income" className="flex items-center space-x-1">
                  <span>Gross Income</span>
                  <span className="text-gray-400 text-xs">(optional)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('income')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="80000"
                  value={formData.income}
                  onChange={(e) => handleInputChange('income', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'income' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-3sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.income}
                  </div>
                )}
              </div>

              {/* Taxes + Insurance (Optional) */}
              <div className="relative">
                <Label htmlFor="taxesInsurance" className="flex items-center space-x-1">
                  <span>Taxes + Insurance</span>
                  <span className="text-gray-400 text-xs">(optional)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('taxesInsurance')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="taxesInsurance"
                  type="number"
                  placeholder="450"
                  value={formData.taxesInsurance}
                  onChange={(e) => handleInputChange('taxesInsurance', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'taxesInsurance' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.taxesInsurance}
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800 min-h-[44px]"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Payment'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Card */}
        {result && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Monthly Payment</div>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(result.payment * 100)}
                  </div>
                </div>
                {result.dti && (
                  <div>
                    <div className="text-sm text-gray-600">Est. DTI</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {result.dti}%
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Numbers update instantly — perfect for quick client conversations.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recent Calculations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Calculations</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/tools/affordability')}
              >
                See All Calculations
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  No calculations yet. Run your first scenario in seconds.
                </p>
                <Button onClick={handleCalculate}>Calculate Payment</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Loan</th>
                        <th className="pb-2">Payment</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {history.map((calc) => (
                        <tr key={calc.id} className="border-t">
                          <td className="py-2 text-sm">{formatDate(calc.date)}</td>
                          <td className="py-2 text-sm">{formatCurrency(calc.loanAmount * 100)}</td>
                          <td className="py-2 text-sm font-medium">{formatCurrency(calc.payment * 100)}</td>
                          <td className="py-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              calc.saved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {calc.saved ? 'Saved' : 'Not Saved'}
                            </span>
                          </td>
                          <td className="py-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/tools/affordability?calc=${calc.id}`)}
                                className="text-primary hover:text-secondary text-sm"
                                title="Open calculation"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(calc.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                                title="Delete calculation"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {history.map((calc) => (
                    <Card key={calc.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{formatCurrency(calc.loanAmount * 100)}</div>
                          <div className="text-sm text-gray-500">{formatDate(calc.date)}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          calc.saved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {calc.saved ? 'Saved' : 'Not Saved'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold text-primary">
                          {formatCurrency(calc.payment * 100)}/mo
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/tools/affordability?calc=${calc.id}`)}
                          >
                            Open
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(calc.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MortgagePanel;