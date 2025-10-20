import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ExternalLink, Trash2, Eye, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { mockDashboardAPI, formatCurrency, formatDate } from '../../services/mockDashboardAPI';

const SellerNetPanel = () => {
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showTooltip, setShowTooltip] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    price: '',
    fees: '',
    closingCosts: '',
    payoff: ''
  });

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await mockDashboardAPI.net.history({ limit: 3 });
      setHistory(response.items);
    } catch (error) {
      console.error('Failed to load net sheet history:', error);
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

  const handleEstimate = async () => {
    // Validation
    if (!formData.price || !formData.fees || !formData.closingCosts || !formData.payoff) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      setIsCalculating(true);
      
      const data = {
        price: parseFloat(formData.price),
        fees: parseFloat(formData.fees),
        closingCosts: parseFloat(formData.closingCosts),
        payoff: parseFloat(formData.payoff)
      };

      const response = await mockDashboardAPI.net.estimate(data);
      setResult(response);

      // Analytics event
      if (window.gtag) {
        window.gtag('event', 'net_sheet_calculation', {
          sale_price: data.price,
          estimated_net: response.net
        });
      }

    } catch (error) {
      console.error('Estimation failed:', error);
      alert('Estimation failed. Please try again.');  
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this net sheet estimate?')) return;
    
    try {
      await mockDashboardAPI.net.delete(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50';
      toast.textContent = 'Net sheet estimate deleted.';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const tooltips = {
    price: "Expected home sale price.",
    fees: "Estimated fees (title, escrow, real estate commissions, etc.).",
    closingCosts: "Buyer-paid or shared closing costs.",
    payoff: "Remaining mortgage loan balance."
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Seller Net Sheet Estimator
            </h1>
            <p className="text-gray-600 mt-1">
              Give sellers instant clarity on net proceeds.
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate('/tools/net-sheet')}
            className="mt-4 sm:mt-0 flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Go to Full Estimator</span>
          </Button>
        </div>

        {/* Quick Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Quick Net Estimate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              
              {/* Sale Price */}
              <div className="relative">
                <Label htmlFor="price" className="flex items-center space-x-1">
                  <span>Sale Price</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('price')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="425000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'price' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.price}
                  </div>
                )}
              </div>

              {/* Estimated Fees */}
              <div className="relative">
                <Label htmlFor="fees" className="flex items-center space-x-1">
                  <span>Estimated Fees</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('fees')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="fees"
                  type="number"
                  placeholder="8500"
                  value={formData.fees}
                  onChange={(e) => handleInputChange('fees', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'fees' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.fees}
                  </div>
                )}
              </div>

              {/* Estimated Closing Costs */}
              <div className="relative">
                <Label htmlFor="closingCosts" className="flex items-center space-x-1">
                  <span>Closing Costs</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('closingCosts')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="closingCosts"
                  type="number"
                  placeholder="3200"
                  value={formData.closingCosts}
                  onChange={(e) => handleInputChange('closingCosts', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'closingCosts' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.closingCosts}
                  </div>
                )}
              </div>

              {/* Mortgage Payoff */}
              <div className="relative">
                <Label htmlFor="payoff" className="flex items-center space-x-1">
                  <span>Mortgage Payoff</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('payoff')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="payoff"
                  type="number"
                  placeholder="180000"
                  value={formData.payoff}
                  onChange={(e) => handleInputChange('payoff', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'payoff' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.payoff}
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleEstimate}
              disabled={isCalculating}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800 min-h-[44px]"
            >
              {isCalculating ? 'Calculating...' : 'Estimate Net'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Card */}
        {result && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600">Estimated Net to Seller</div>
                <div className="text-4xl font-bold text-primary">
                  {formatCurrency(result.net * 100)}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                Use this estimate in listing presentations or live with clients.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recent Estimates */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Estimates</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/tools/net-sheet')}
              >
                See All Estimates
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
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  No estimates yet. Create one to see seller net.
                </p>
                <Button onClick={handleEstimate}>Estimate Net</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Sale Price</th>
                        <th className="pb-2">Net</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {history.map((estimate) => (
                        <tr key={estimate.id} className="border-t">
                          <td className="py-2 text-sm">{formatDate(estimate.date)}</td>
                          <td className="py-2 text-sm">{formatCurrency(estimate.price * 100)}</td>
                          <td className="py-2 text-sm font-medium text-primary">
                            {formatCurrency(estimate.net * 100)}
                          </td>
                          <td className="py-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/tools/net-sheet?calc=${estimate.id}`)}
                                className="text-primary hover:text-secondary text-sm"
                                title="Open estimate"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(estimate.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                                title="Delete estimate"
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
                  {history.map((estimate) => (
                    <Card key={estimate.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{formatCurrency(estimate.price * 100)}</div>
                          <div className="text-sm text-gray-500">{formatDate(estimate.date)}</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold text-primary">
                          {formatCurrency(estimate.net * 100)} net
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/tools/net-sheet?calc=${estimate.id}`)}
                          >
                            Open
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(estimate.id)}
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

export default SellerNetPanel;