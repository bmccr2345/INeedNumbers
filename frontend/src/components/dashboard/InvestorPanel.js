import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, Download, Edit, Copy, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { mockDashboardAPI, formatDate } from '../../services/mockDashboardAPI';

const InvestorPanel = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [investors, setInvestors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    loadInvestors();
  }, []);

  const loadInvestors = async () => {
    try {
      setIsLoading(true);
      const response = await mockDashboardAPI.investor.list();
      setInvestors(response.items);
    } catch (error) {
      console.error('Failed to load investor PDFs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this investor PDF?')) return;
    
    try {
      await mockDashboardAPI.investor.delete(id);
      setInvestors(prev => prev.filter(item => item.id !== id));
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50';
      toast.textContent = 'Investor PDF deleted.';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const handleBulkDownload = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const response = await mockDashboardAPI.investor.bulkDownload(selectedItems);
      window.open(response.url, '_blank');
      
      // Analytics event
      if (window.gtag) {
        window.gtag('event', 'investor_pdf_bulk_download', {
          count: selectedItems.length
        });
      }
      
    } catch (error) {
      console.error('Bulk download failed:', error);
      alert('Bulk download failed. Please try again.');
    }
  };

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || investor.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Investor Deal PDFs
            </h1>
            <p className="text-gray-600 mt-1">
              Create polished investor packets instantly.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Your saved investor packets appear here. Download, edit, or duplicate.
            </p>
          </div>
          
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button
              onClick={() => navigate('/calculator')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
            >
              Create New Investor PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/calculator')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Go to Full Investor Tool
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="ready">Ready</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : filteredInvestors.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-500 mb-4">
                  No investor packets yet — impress your first investor in minutes.
                </p>
                <Button 
                  onClick={() => navigate('/calculator')}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
                >
                  Create New Investor PDF
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                  <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-md">
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} selected
                    </span>
                    <Button
                      size="sm"
                      onClick={handleBulkDownload}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Bulk Download ZIP</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm(`Delete ${selectedItems.length} selected items?`)) {
                          // Handle bulk delete
                          setSelectedItems([]);
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Bulk Delete</span>
                    </Button>
                  </div>
                )}

                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-2">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems(filteredInvestors.map(item => item.id));
                              } else {
                                setSelectedItems([]);
                              }
                            }}
                            checked={selectedItems.length === filteredInvestors.length && filteredInvestors.length > 0}
                          />
                        </th>
                        <th className="pb-2">Property</th>
                        <th className="pb-2">Last Updated</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Size</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvestors.map((investor) => (
                        <tr key={investor.id} className="border-t">
                          <td className="py-3">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(investor.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems(prev => [...prev, investor.id]);
                                } else {
                                  setSelectedItems(prev => prev.filter(id => id !== investor.id));
                                }
                              }}
                            />
                          </td>
                          <td className="py-3 text-sm font-medium">{investor.property}</td>
                          <td className="py-3 text-sm text-gray-500">{formatDate(investor.lastUpdated)}</td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-1 rounded ${
                              investor.status === 'Ready' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {investor.status}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-gray-500">{investor.size}</td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => window.open('#mock-pdf-download', '_blank')}
                                className="text-primary hover:text-secondary text-sm"
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => navigate(`/calculator?edit=${investor.id}`)}
                                className="text-gray-600 hover:text-gray-800 text-sm"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    const response = await mockDashboardAPI.investor.duplicate(investor.id);
                                    loadInvestors(); // Reload list
                                  } catch (error) {
                                    console.error('Duplicate failed:', error);
                                  }
                                }}
                                className="text-gray-600 hover:text-gray-800 text-sm"
                                title="Duplicate"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(investor.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                                title="Delete"
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
                  {filteredInvestors.map((investor) => (
                    <Card key={investor.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium">{investor.property}</h3>
                          <p className="text-sm text-gray-500">{formatDate(investor.lastUpdated)}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          investor.status === 'Ready' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {investor.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{investor.size}</span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => window.open('#mock-pdf-download', '_blank')}
                          >
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/calculator?edit=${investor.id}`)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(investor.id)}
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

export default InvestorPanel;