import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Plus, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  FileText,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Filter,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import Footer from '../components/Footer';
import { navigateToHome } from '../utils/navigation';

const AgentPLTracker = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [dateRange, setDateRange] = useState('thisMonth');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    type: 'income', // 'income' or 'expense'
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    note: '',
    repeatMonthly: false
  });

  const incomeCategories = [
    'Commission Income',
    'Referral Fees', 
    'Other Income'
  ];

  const expenseCategories = [
    'Brokerage Fees',
    'Marketing & Advertising',
    'MLS/Association Dues',
    'Transaction Fees',
    'Office Supplies & Software',
    'Travel & Auto',
    'Education & Training',
    'Insurance',
    'Miscellaneous'
  ];

  // Check if user has Pro plan access
  const hasPro = user?.plan === 'PRO';

  useEffect(() => {
    if (user && hasPro) {
      loadEntries();
    }
  }, [user, hasPro]);

  const loadEntries = async () => {
    // Mock data for demo - in real app, fetch from API
    const mockEntries = [
      { id: 1, type: 'income', date: '2025-09-15', amount: 12000, category: 'Commission Income', note: '123 Main St Sale', repeatMonthly: false },
      { id: 2, type: 'expense', date: '2025-09-10', amount: 500, category: 'Marketing & Advertising', note: 'Facebook Ads', repeatMonthly: true },
      { id: 3, type: 'income', date: '2025-09-08', amount: 800, category: 'Referral Fees', note: 'Client referral to Mike', repeatMonthly: false },
      { id: 4, type: 'expense', date: '2025-09-05', amount: 150, category: 'MLS/Association Dues', note: 'Monthly MLS fee', repeatMonthly: true },
      { id: 5, type: 'expense', date: '2025-09-01', amount: 300, category: 'Office Supplies & Software', note: 'CRM subscription', repeatMonthly: true }
    ];
    setEntries(mockEntries);
  };

  const handleAddEntry = async () => {
    if (!formData.amount || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount)
    };

    setEntries([newEntry, ...entries]);
    setShowAddDialog(false);
    resetForm();
    toast.success(`${formData.type === 'income' ? 'Income' : 'Expense'} added successfully`);
  };

  const resetForm = () => {
    setFormData({
      type: 'income',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: '',
      note: '',
      repeatMonthly: false
    });
  };

  const calculateTotals = () => {
    const filtered = filterEntriesByDate(entries);
    const income = filtered.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const expenses = filtered.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    return { income, expenses, net: income - expenses };
  };

  const filterEntriesByDate = (entries) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      
      switch (dateRange) {
        case 'thisMonth':
          return entryDate >= startOfMonth;
        case 'lastMonth':
          return entryDate >= startOfLastMonth && entryDate <= endOfLastMonth;
        case 'ytd':
          return entryDate >= startOfYear;
        default:
          return true;
      }
    });
  };

  const getCategorySummary = () => {
    const filtered = filterEntriesByDate(entries);
    const summary = {};
    
    [...incomeCategories, ...expenseCategories].forEach(category => {
      const categoryEntries = filtered.filter(e => e.category === category);
      const income = categoryEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
      const expenses = categoryEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
      
      if (income > 0 || expenses > 0) {
        summary[category] = { income, expenses, net: income - expenses };
      }
    });
    
    return summary;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Pro plan gate
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-neutral-medium flex flex-col">
        <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-medium/20">
          <div className="container mx-auto px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => navigateToHome(navigate, user)}
              className="text-deep-forest hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </nav>
        
        <div className="flex-grow flex items-center justify-center p-6">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to access the Agent P&L Tracker
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/auth/login')} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hasPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-neutral-medium flex flex-col">
        <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-medium/20">
          <div className="container mx-auto px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => navigateToHome(navigate, user)}
              className="text-deep-forest hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </nav>
        
        <div className="flex-grow flex items-center justify-center p-6">
          <Card className="max-w-lg mx-auto text-center">
            <CardHeader>
              <Badge className="mx-auto mb-4 bg-gradient-to-r from-primary to-secondary text-white">
                PRO FEATURE
              </Badge>
              <CardTitle className="text-2xl">Agent P&L Tracker</CardTitle>
              <CardDescription className="text-lg">
                Track your income, expenses, and net profit with simple entry and professional reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-left space-y-2">
                <h4 className="font-semibold">What you get:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Quick income & expense entry</li>
                  <li>• Professional P&L reports</li>
                  <li>• Category-based insights</li>
                  <li>• Export to PDF & Excel</li>
                  <li>• Monthly/yearly summaries</li>
                </ul>
              </div>
              <Button 
                onClick={() => navigate('/pricing')} 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800"
                size="lg"
              >
                Upgrade to Pro
              </Button>
              <p className="text-xs text-gray-500">
                Your personal business scoreboard awaits
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const totals = calculateTotals();
  const categorySummary = getCategorySummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-neutral-medium flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-medium/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-deep-forest hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div className="flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-deep-forest">Agent P&L Tracker</h1>
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white">PRO</Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                My Account
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow container mx-auto px-6 py-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-deep-forest">Your Business Dashboard</h2>
            <p className="text-neutral-dark">Track income, expenses, and grow your business</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-emerald-700 hover:to-emerald-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white border-gray-200">
                <DialogHeader>
                  <DialogTitle>Add Income or Expense</DialogTitle>
                  <DialogDescription>
                    Track your business finances with quick entry
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <Tabs value={formData.type} onValueChange={(value) => setFormData({...formData, type: value, category: ''})}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="income" className="text-green-700">Income</TabsTrigger>
                      <TabsTrigger value="expense" className="text-red-700">Expense</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(formData.type === 'income' ? incomeCategories : expenseCategories).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Input
                      id="note"
                      placeholder="Add a note..."
                      value={formData.note}
                      onChange={(e) => setFormData({...formData, note: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="repeat"
                      checked={formData.repeatMonthly}
                      onCheckedChange={(checked) => setFormData({...formData, repeatMonthly: checked})}
                    />
                    <Label htmlFor="repeat" className="text-sm">Repeat monthly</Label>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleAddEntry} className="flex-1 bg-gradient-to-r from-primary to-secondary">
                      Add Entry
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Totals Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-700">Total Income</h3>
              </div>
              <p className="text-2xl font-bold text-green-700 mt-2">{formatCurrency(totals.income)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-700">Total Expenses</h3>
              </div>
              <p className="text-2xl font-bold text-red-700 mt-2">{formatCurrency(totals.expenses)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-primary">Net Profit</h3>
              </div>
              <p className={`text-2xl font-bold mt-2 ${totals.net >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(totals.net)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Summary */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Category Summary</CardTitle>
              <CardDescription>Breakdown by income and expense categories</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Category</th>
                    <th className="text-right py-2">Income</th>
                    <th className="text-right py-2">Expenses</th>
                    <th className="text-right py-2">Net</th>
                    <th className="text-right py-2">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(categorySummary).map(([category, data]) => (
                    <tr key={category} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-medium">{category}</td>
                      <td className="text-right py-2 text-green-700">
                        {data.income > 0 ? formatCurrency(data.income) : '-'}
                      </td>
                      <td className="text-right py-2 text-red-700">
                        {data.expenses > 0 ? formatCurrency(data.expenses) : '-'}
                      </td>
                      <td className={`text-right py-2 font-semibold ${data.net >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {formatCurrency(data.net)}
                      </td>
                      <td className="text-right py-2 text-gray-600">
                        {Math.abs(data.net) > 0 ? ((Math.abs(data.net) / Math.abs(totals.net)) * 100).toFixed(1) + '%' : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>Your latest income and expense entries</CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No entries yet</p>
                <p className="text-sm">Add your first income or expense to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filterEntriesByDate(entries).slice(0, 10).map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${entry.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="font-medium">{entry.category}</p>
                        <p className="text-sm text-gray-600">{entry.note || 'No note'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${entry.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                        {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                      </p>
                      <p className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default AgentPLTracker;