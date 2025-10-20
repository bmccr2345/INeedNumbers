import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Save } from 'lucide-react';
import Cookies from 'js-cookie';

const GoalSettingsPanel = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    goalType: 'gci',
    annualGciGoal: '',
    monthlyGciTarget: '',
    avgGciPerClosing: '',
    workdays: '',
    earnedGciToDate: ''
  });

  // Format number with commas for display
  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    const number = value.toString().replace(/,/g, '');
    if (/^\d+$/.test(number)) {
      return parseInt(number).toLocaleString();
    }
    return value;
  };

  // Parse formatted number back to plain number
  const parseFormattedNumber = (value) => {
    return value.replace(/,/g, '');
  };

  // Get current month for backend
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const getHeaders = () => {
    const token = Cookies.get('access_token');
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/goal-settings`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        
        // Update local settings with loaded data
        setLocalSettings({
          goalType: data.goalType || 'gci',
          annualGciGoal: data.annualGciGoal?.toString() || '',
          monthlyGciTarget: data.monthlyGciTarget?.toString() || '',
          avgGciPerClosing: data.avgGciPerClosing?.toString() || '',
          workdays: data.workdays?.toString() || '',
          earnedGciToDate: data.earnedGciToDate?.toString() || ''
        });
      }
    } catch (error) {
      console.error('Error loading goal settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    const numericValue = parseFormattedNumber(value);
    // Allow empty or numeric values only
    if (numericValue === '' || /^\d+$/.test(numericValue)) {
      setLocalSettings(prev => ({
        ...prev,
        [field]: numericValue
      }));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Create a new goal settings endpoint specifically for goals
      const goalData = {
        goalType: localSettings.goalType,
        annualGciGoal: localSettings.annualGciGoal ? parseInt(localSettings.annualGciGoal) : null,
        monthlyGciTarget: localSettings.monthlyGciTarget ? parseFloat(localSettings.monthlyGciTarget) : null,
        avgGciPerClosing: localSettings.avgGciPerClosing ? parseFloat(localSettings.avgGciPerClosing) : null,
        workdays: localSettings.workdays ? parseInt(localSettings.workdays) : 20,
        earnedGciToDate: localSettings.earnedGciToDate ? parseFloat(localSettings.earnedGciToDate) : 0
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/goal-settings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(goalData)
      });

      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
        alert('Goal settings saved successfully!');
      } else {
        throw new Error('Failed to save goal settings');
      }
    } catch (error) {
      console.error('Error saving goal settings:', error);
      alert('Error saving goal settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading goal settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Goal Settings</CardTitle>
          <p className="text-gray-600">Configure your monthly goals and targets</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="goalType">Goal Type</Label>
            <Select
              value={localSettings.goalType}
              onValueChange={(value) => setLocalSettings(prev => ({...prev, goalType: value}))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gci">GCI (Gross Commission Income)</SelectItem>
                <SelectItem value="closings">Number of Closings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="annualGciGoal">Annual GCI Goal</Label>
            <Input
              id="annualGciGoal"
              value={formatNumberWithCommas(localSettings.annualGciGoal)}
              onChange={(e) => handleInputChange('annualGciGoal', e.target.value)}
              placeholder="250,000"
            />
            <p className="text-sm text-gray-600 mt-1">
              Total amount you want to make for the year
            </p>
          </div>

          <div>
            <Label htmlFor="monthlyGciTarget">Monthly GCI Target</Label>
            <Input
              id="monthlyGciTarget"
              value={formatNumberWithCommas(localSettings.monthlyGciTarget)}
              onChange={(e) => handleInputChange('monthlyGciTarget', e.target.value)}
              placeholder="20,000"
            />
          </div>

          <div>
            <Label htmlFor="avgGciPerClosing">Average GCI per Closing</Label>
            <Input
              id="avgGciPerClosing"
              value={formatNumberWithCommas(localSettings.avgGciPerClosing)}
              onChange={(e) => handleInputChange('avgGciPerClosing', e.target.value)}
              placeholder="10,000"
            />
          </div>

          <div>
            <Label htmlFor="workdays">Working Days This Month</Label>
            <Input
              id="workdays"
              value={localSettings.workdays}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 31)) {
                  handleInputChange('workdays', value);
                }
              }}
              placeholder="22"
            />
          </div>

          <div>
            <Label htmlFor="earnedGciToDate">Earned GCI To Date</Label>
            <Input
              id="earnedGciToDate"
              value={formatNumberWithCommas(localSettings.earnedGciToDate)}
              onChange={(e) => handleInputChange('earnedGciToDate', e.target.value)}
              placeholder="50,000"
            />
            <p className="text-sm text-gray-600 mt-1">
              Manual backup if P&L data is not available
            </p>
          </div>

          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Goal Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalSettingsPanel;