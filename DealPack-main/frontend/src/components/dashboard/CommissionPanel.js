import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ExternalLink, Trash2, Eye, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { mockDashboardAPI, formatCurrency, formatDate } from '../../services/mockDashboardAPI';

const CommissionPanel = () => {
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showTooltip, setShowTooltip] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    gross: '',
    brokeragePct: '',
    referralPct: '',
    teamPct: '',
    feesFlat: '',
    feesPct: ''
  });

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await mockDashboardAPI.commission.history({ limit: 3 });
      setHistory(response.items);
    } catch (error) {
      console.error('Failed to load commission history:', error);
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
    if (!formData.gross || !formData.brokeragePct) {
      alert('Please fill in Gross Commission and Brokerage Split %.');
      return;
    }

    try {
      setIsCalculating(true);
      
      const data = {
        gross: parseFloat(formData.gross),
        brokeragePct: parseFloat(formData.brokeragePct),
        referralPct: formData.referralPct ? parseFloat(formData.referralPct) : 0,
        teamPct: formData.teamPct ? parseFloat(formData.teamPct) : 0,
        feesFlat: formData.feesFlat ? parseFloat(formData.feesFlat) : 0,
        feesPct: formData.feesPct ? parseFloat(formData.feesPct) : 0
      };

      const response = await mockDashboardAPI.commission.calc(data);
      setResult(response);

      // Analytics event
      if (window.gtag) {
        window.gtag('event', 'commission_calculation', {
          gross_amount: data.gross,
          brokerage_pct: data.brokeragePct
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
    if (!confirm('Delete this commission split?')) return;
    
    try {
      await mockDashboardAPI.commission.delete(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50';
      toast.textContent = 'Commission split deleted.';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const tooltips = {
    gross: "Total commission before splits and fees.",
    brokeragePct: "Percentage kept by your brokerage.",
    referralPct: "Optional referral fee percentage.",
    teamPct: "Optional split with team members.",
    feesFlat: "Flat fees charged (dollar amount).",
    feesPct: "Percentage-based fees charged."
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Commission Split Calculator
            </h1>
            <p className="text-gray-600 mt-1">
              See your true take-home at a glance.
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate('/tools/commission-split')}
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
              <DollarSign className="w-5 h-5" />
              <span>Quick Split Calculation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              
              {/* Gross Commission */}
              <div className="relative">
                <Label htmlFor="gross" className="flex items-center space-x-1">
                  <span>Gross Commission</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('gross')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="gross"
                  type="number"
                  placeholder="12000"
                  value={formData.gross}
                  onChange={(e) => handleInputChange('gross', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'gross' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.gross}
                  </div>
                )}
              </div>

              {/* Brokerage Split % */}
              <div className="relative">
                <Label htmlFor="brokeragePct" className="flex items-center space-x-1">
                  <span>Brokerage Split %</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('brokeragePct')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="brokeragePct"
                  type="number"
                  placeholder="30"
                  value={formData.brokeragePct}
                  onChange={(e) => handleInputChange('brokeragePct', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'brokeragePct' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.brokeragePct}
                  </div>
                )}
              </div>

              {/* Referral % (Optional) */}
              <div className="relative">
                <Label htmlFor="referralPct" className="flex items-center space-x-1">
                  <span>Referral %</span>
                  <span className="text-gray-400 text-xs">(optional)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('referralPct')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="referralPct"
                  type="number"
                  placeholder="10"
                  value={formData.referralPct}
                  onChange={(e) => handleInputChange('referralPct', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'referralPct' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.referralPct}
                  </div>
                )}
              </div>

              {/* Team Split % (Optional) */}
              <div className="relative">
                <Label htmlFor="teamPct" className="flex items-center space-x-1">
                  <span>Team Split %</span>
                  <span className="text-gray-400 text-xs">(optional)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('teamPct')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="teamPct"
                  type="number"
                  placeholder="10"
                  value={formData.teamPct}
                  onChange={(e) => handleInputChange('teamPct', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'teamPct' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.teamPct}
                  </div>
                )}
              </div>

              {/* Fees (Flat) */}
              <div className="relative">
                <Label htmlFor="feesFlat" className="flex items-center space-x-1">
                  <span>Fees ($)</span>
                  <span className="text-gray-400 text-xs">(optional)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('feesFlat')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="feesFlat"
                  type="number"
                  placeholder="100"
                  value={formData.feesFlat}
                  onChange={(e) => handleInputChange('feesFlat', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'feesFlat' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.feesFlat}
                  </div>
                )}
              </div>

              {/* Fees (%) */}
              <div className="relative">
                <Label htmlFor="feesPct" className="flex items-center space-x-1">
                  <span>Fees %</span>
                  <span className="text-gray-400 text-xs">(optional)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('feesPct')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="feesPct"
                  type="number"
                  placeholder="2"
                  value={formData.feesPct}
                  onChange={(e) => handleInputChange('feesPct', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'feesPct' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.feesPct}
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800 min-h-[44px]"
            >
              {isCalculating ? 'Calculating...' : 'Run Split'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Card */}
        {result && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="text-sm text-gray-600">Take-Home Amount</div>
                <div className="text-4xl font-bold text-primary">
                  {formatCurrency(result.takeHome * 100)}
                </div>
              </div>
              
              {/* Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-500">Brokerage</div>
                  <div className="text-sm font-medium text-red-600">
                    -{formatCurrency(result.breakdown.brokerage * 100)}
                  </div>
                </div>
                {result.breakdown.referral > 0 && (
                  <div>
                    <div className="text-xs text-gray-500">Referral</div>
                    <div className="text-sm font-medium text-red-600">
                      -{formatCurrency(result.breakdown.referral * 100)}
                    </div>
                  </div>
                )}
                {result.breakdown.team > 0 && (
                  <div>
                    <div className="text-xs text-gray-500">Team</div>
                    <div className="text-sm font-medium text-red-600">
                      -{formatCurrency(result.breakdown.team * 100)}
                    </div>
                  </div>
                )}
                {result.breakdown.fees > 0 && (
                  <div>
                    <div className="text-xs text-gray-500">Fees</div>
                    <div className="text-sm font-medium text-red-600">
                      -{formatCurrency(result.breakdown.fees * 100)}
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-4">
                Breakdowns show exactly where your money goes.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recent Splits */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Splits</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/tools/commission-split')}
              >
                See All Splits
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
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  No splits yet. Run your first calculation to see take-home.
                </p>
                <Button onClick={handleCalculate}>Run Split</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Take-Home</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {history.map((split) => (
                        <tr key={split.id} className="border-t">
                          <td className="py-2 text-sm">{formatDate(split.date)}</td>
                          <td className="py-2 text-sm">{formatCurrency(split.gross * 100)}</td>
                          <td className="py-2 text-sm font-medium text-primary">
                            {formatCurrency(split.takeHome * 100)}
                          </td>
                          <td className="py-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/tools/commission-split?calc=${split.id}`)}
                                className="text-primary hover:text-secondary text-sm"
                                title="Open split"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(split.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                                title="Delete split"
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
                  {history.map((split) => (
                    <Card key={split.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{formatCurrency(split.gross * 100)}</div>
                          <div className="text-sm text-gray-500">{formatDate(split.date)}</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold text-primary">
                          {formatCurrency(split.takeHome * 100)} take-home
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/tools/commission-split?calc=${split.id}`)}
                          >
                            Open
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(split.id)}
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

export default CommissionPanel;