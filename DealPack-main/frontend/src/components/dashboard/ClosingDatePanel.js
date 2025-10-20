import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ExternalLink, Trash2, Eye, HelpCircle, Clock, CheckCircle, AlertCircle, XCircle, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { mockDashboardAPI, formatDate } from '../../services/mockDashboardAPI';

const ClosingDatePanel = () => {
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showTooltip, setShowTooltip] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    underContractDate: '',
    closingDate: '',
    pestInspectionDays: '7',
    homeInspectionDays: '10',
    dueDiligenceRepairRequestsDays: '14',
    finalWalkthroughDays: '1',
    appraisalDays: '7'
  });

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      // Mock API call - in real implementation this would fetch from backend
      const mockHistory = [
        {
          id: '1',
          title: 'Closing Timeline - Dec 15, 2024',
          underContractDate: '2024-11-01',
          closingDate: '2024-12-15',
          created_at: new Date().toISOString(),
          milestone_count: 8
        },
        {
          id: '2', 
          title: 'Closing Timeline - Jan 20, 2025',
          underContractDate: '2024-12-01',
          closingDate: '2025-01-20',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          milestone_count: 6
        }
      ];
      setHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load closing date history:', error);
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
    if (!formData.underContractDate || !formData.closingDate) {
      alert('Please provide both Under Contract Date and Closing Date');
      return;
    }

    setIsCalculating(true);
    
    try {
      // Calculate timeline
      const underContractDate = new Date(formData.underContractDate);
      const closingDate = new Date(formData.closingDate);
      
      const milestones = [
        {
          name: 'Under Contract',
          date: underContractDate,
          type: 'contract',
          status: 'completed'
        }
      ];

      // Add milestones based on form data
      if (formData.pestInspectionDays) {
        const pestDate = new Date(underContractDate);
        pestDate.setDate(pestDate.getDate() + parseInt(formData.pestInspectionDays));
        milestones.push({
          name: 'Pest Inspection',
          date: pestDate,
          type: 'inspection',
          status: pestDate < new Date() ? 'past-due' : 'upcoming'
        });
      }

      if (formData.homeInspectionDays) {
        const homeDate = new Date(underContractDate);
        homeDate.setDate(homeDate.getDate() + parseInt(formData.homeInspectionDays));
        milestones.push({
          name: 'Home Inspection',
          date: homeDate,
          type: 'inspection',
          status: homeDate < new Date() ? 'past-due' : 'upcoming'
        });
      }

      if (formData.dueDiligenceRepairRequestsDays) {
        const repairDate = new Date(underContractDate);
        repairDate.setDate(repairDate.getDate() + parseInt(formData.dueDiligenceRepairRequestsDays));
        milestones.push({
          name: 'Repair Requests Due',
          date: repairDate,
          type: 'deadline',
          status: repairDate < new Date() ? 'past-due' : 'upcoming'
        });
      }

      if (formData.finalWalkthroughDays) {
        const walkthroughDate = new Date(closingDate);
        walkthroughDate.setDate(walkthroughDate.getDate() - parseInt(formData.finalWalkthroughDays));
        milestones.push({
          name: 'Final Walkthrough',
          date: walkthroughDate,
          type: 'inspection',
          status: walkthroughDate < new Date() ? 'past-due' : 'upcoming'
        });
      }

      if (formData.appraisalDays) {
        const appraisalDate = new Date(closingDate);
        appraisalDate.setDate(appraisalDate.getDate() - parseInt(formData.appraisalDays));
        milestones.push({
          name: 'Appraisal Due',
          date: appraisalDate,
          type: 'financial',
          status: appraisalDate < new Date() ? 'past-due' : 'upcoming'
        });
      }

      milestones.push({
        name: 'Closing Date',
        date: closingDate,
        type: 'closing',
        status: 'upcoming'
      });

      // Sort by date
      milestones.sort((a, b) => a.date - b.date);

      setResult({
        underContractDate: formData.underContractDate,
        closingDate: formData.closingDate,
        milestones: milestones,
        totalDays: Math.ceil((closingDate - underContractDate) / (1000 * 60 * 60 * 24))
      });

      // Reload history to show the new calculation
      await loadHistory();
      
    } catch (error) {
      console.error('Calculation failed:', error);
      alert('Calculation failed. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this timeline? This cannot be undone.')) return;
    
    try {
      // Mock delete - in real implementation this would call the backend
      setHistory(prev => prev.filter(item => item.id !== id));
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      toast.textContent = 'Timeline deleted successfully';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const handleDownload = async (item) => {
    try {
      // Show loading toast
      const loadingToast = document.createElement('div');
      loadingToast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50';
      loadingToast.textContent = 'Generating PDF...';
      document.body.appendChild(loadingToast);

      // Mock PDF generation - in real implementation this would call the backend API
      // For now, we'll simulate the download
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create mock PDF data
      const pdfData = {
        title: item.title,
        underContractDate: item.underContractDate,
        closingDate: item.closingDate,
        timeline: [
          {
            name: 'Under Contract',
            date: item.underContractDate,
            type: 'contract',
            status: 'completed',
            description: 'Contract was signed and executed'
          },
          {
            name: 'Pest Inspection',
            date: new Date(new Date(item.underContractDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'inspection',
            status: 'past-due',
            description: 'Professional pest inspection'
          },
          {
            name: 'Home Inspection',
            date: new Date(new Date(item.underContractDate).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'inspection',
            status: 'past-due',
            description: 'Comprehensive home inspection'
          },
          {
            name: 'Closing Date',
            date: item.closingDate,
            type: 'closing',
            status: 'upcoming',
            description: 'Final closing and transfer of ownership'
          }
        ]
      };

      // In real implementation, this would make an API call to generate the PDF
      // For now, we'll simulate by creating a blob and downloading it
      const pdfContent = `Closing Timeline PDF - ${item.title}\n\nContract Date: ${formatDate(item.underContractDate)}\nClosing Date: ${formatDate(item.closingDate)}\nMilestones: ${item.milestone_count}`;
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Remove loading toast and show success
      document.body.removeChild(loadingToast);
      
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      successToast.textContent = 'PDF downloaded successfully!';
      document.body.appendChild(successToast);
      setTimeout(() => document.body.removeChild(successToast), 3000);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'today':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'upcoming':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'past-due':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatMilestoneDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const tooltips = {
    underContractDate: "The date when the purchase agreement was signed by all parties.",
    closingDate: "The target date for final closing and transfer of ownership.",
    pestInspectionDays: "Days after under contract date to complete pest inspection.",
    homeInspectionDays: "Days after under contract date to complete home inspection.",
    dueDiligenceRepairRequestsDays: "Days after under contract date to submit repair requests.",
    finalWalkthroughDays: "Days before closing date to do final walkthrough.",
    appraisalDays: "Days before closing date that appraisal must be completed."
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Closing Date Calculator
            </h1>
            <p className="text-gray-600 mt-1">
              Track your home purchase timeline and milestones.
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate('/tools/closing-date')}
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
              <Calendar className="w-5 h-5" />
              <span>Quick Timeline Calculation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              
              {/* Under Contract Date */}
              <div className="relative">
                <Label htmlFor="underContractDate" className="flex items-center space-x-1">
                  <span>Under Contract Date</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('underContractDate')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="underContractDate"
                  type="date"
                  value={formData.underContractDate}
                  onChange={(e) => handleInputChange('underContractDate', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'underContractDate' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.underContractDate}
                  </div>
                )}
              </div>

              {/* Closing Date */}
              <div className="relative">
                <Label htmlFor="closingDate" className="flex items-center space-x-1">
                  <span>Closing Date</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('closingDate')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="closingDate"
                  type="date"
                  value={formData.closingDate}
                  onChange={(e) => handleInputChange('closingDate', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'closingDate' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.closingDate}
                  </div>
                )}
              </div>

              {/* Pest Inspection Days */}
              <div className="relative">
                <Label htmlFor="pestInspectionDays" className="flex items-center space-x-1">
                  <span>Pest Inspection (Days)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('pestInspectionDays')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="pestInspectionDays"
                  type="number"
                  placeholder="7"
                  value={formData.pestInspectionDays}
                  onChange={(e) => handleInputChange('pestInspectionDays', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'pestInspectionDays' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.pestInspectionDays}
                  </div>
                )}
              </div>

              {/* Home Inspection Days */}
              <div className="relative">
                <Label htmlFor="homeInspectionDays" className="flex items-center space-x-1">
                  <span>Home Inspection (Days)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('homeInspectionDays')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="homeInspectionDays"
                  type="number"
                  placeholder="10"
                  value={formData.homeInspectionDays}
                  onChange={(e) => handleInputChange('homeInspectionDays', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'homeInspectionDays' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.homeInspectionDays}
                  </div>
                )}
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              
              {/* Repair Requests Days */}
              <div className="relative">
                <Label htmlFor="dueDiligenceRepairRequestsDays" className="flex items-center space-x-1">
                  <span>Repair Requests (Days)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('dueDiligenceRepairRequestsDays')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="dueDiligenceRepairRequestsDays"
                  type="number"
                  placeholder="14"
                  value={formData.dueDiligenceRepairRequestsDays}
                  onChange={(e) => handleInputChange('dueDiligenceRepairRequestsDays', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'dueDiligenceRepairRequestsDays' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.dueDiligenceRepairRequestsDays}
                  </div>
                )}
              </div>

              {/* Final Walkthrough Days */}
              <div className="relative">
                <Label htmlFor="finalWalkthroughDays" className="flex items-center space-x-1">
                  <span>Final Walkthrough (Days)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('finalWalkthroughDays')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="finalWalkthroughDays"
                  type="number"
                  placeholder="1"
                  value={formData.finalWalkthroughDays}
                  onChange={(e) => handleInputChange('finalWalkthroughDays', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'finalWalkthroughDays' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.finalWalkthroughDays}
                  </div>
                )}
              </div>

              {/* Appraisal Days */}
              <div className="relative">
                <Label htmlFor="appraisalDays" className="flex items-center space-x-1">
                  <span>Appraisal (Days)</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip('appraisalDays')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Label>
                <Input
                  id="appraisalDays"
                  type="number"
                  placeholder="7"
                  value={formData.appraisalDays}
                  onChange={(e) => handleInputChange('appraisalDays', e.target.value)}
                  className="mt-1"
                />
                {showTooltip === 'appraisalDays' && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10 max-w-xs">
                    {tooltips.appraisalDays}
                  </div>
                )}
              </div>

            </div>

            <Button 
              onClick={handleCalculate}
              disabled={isCalculating || !formData.underContractDate || !formData.closingDate}
              className="w-full bg-gradient-to-r from-primary to-secondary"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Timeline'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Timeline Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Contract to Closing: {result.totalDays} days</span>
                  <span>{result.milestones.length} milestones</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(milestone.status)}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{milestone.name}</div>
                      <div className="text-sm text-gray-600">{formatMilestoneDate(milestone.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Timelines */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Timelines</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading recent timelines...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No timelines yet. Create your first one above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Contract: {formatDate(item.underContractDate)}</span>
                        <span>Closing: {formatDate(item.closingDate)}</span>
                        <span>{item.milestone_count} milestones</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/tools/closing-date')}
                        className="text-primary hover:text-primary"
                        title="View Timeline"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(item)}
                        className="text-green-600 hover:text-green-700"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm" 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete Timeline"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ClosingDatePanel;