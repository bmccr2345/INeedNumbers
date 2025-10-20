import React, { useState } from 'react';
import { X, Save, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import Cookies from 'js-cookie';

const ActivityModal = ({ isOpen, onClose, onActivitySaved }) => {
  const [currentEntry, setCurrentEntry] = useState({
    activities: {},
    hours: {},
    reflection: ''
  });
  const [isLogging, setIsLogging] = useState(false);

  // Helper function for API headers
  const getHeaders = () => {
    const token = Cookies.get('access_token');
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  };

  // Format activity name (same as ActionTracker)
  const formatActivityName = (activity) => {
    return activity.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // Handle activity change
  const handleActivityChange = (activity, value) => {
    const numericValue = parseInt(value) || 0;
    setCurrentEntry(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        [activity]: numericValue
      }
    }));
  };

  // Handle hours change
  const handleHoursChange = (category, value) => {
    const numericValue = parseFloat(value) || 0;
    setCurrentEntry(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [category]: numericValue
      }
    }));
  };

  const handleSubmit = async () => {
    if (!currentEntry.activities || Object.keys(currentEntry.activities).length === 0) {
      alert('Please enter some activity data to log.');
      return;
    }

    try {
      setIsLogging(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/activity-log`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          activities: currentEntry.activities,
          hours: currentEntry.hours,
          reflection: currentEntry.reflection
        })
      });

      if (response.ok) {
        // Reset form
        setCurrentEntry({
          activities: {},
          hours: {},
          reflection: ''
        });
        onClose();
        if (onActivitySaved) {
          onActivitySaved();
        }
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        successDiv.textContent = '✅ Activities logged successfully!';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          successDiv.remove();
        }, 3000);
      } else {
        throw new Error('Failed to log activities');
      }
    } catch (error) {
      console.error('Error logging activities:', error);
      alert('Error logging activities. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  const handleClose = () => {
    setCurrentEntry({
      activities: {},
      hours: {},
      reflection: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Log Today's Activities</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Activities Completed */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Activities Completed</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['conversations', 'appointments', 'offersWritten', 'listingsTaken'].map(activity => (
                <div key={activity}>
                  <Label htmlFor={activity} className="text-sm">{formatActivityName(activity)}</Label>
                  <Input
                    id={activity}
                    type="number"
                    value={currentEntry.activities[activity]?.toString() || ''}
                    onChange={(e) => handleActivityChange(activity, e.target.value)}
                    placeholder="0"
                    className="mt-1"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Time Allocation */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Time Allocation (Hours)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['prospecting', 'appointments', 'admin', 'marketing'].map(category => (
                <div key={category}>
                  <Label htmlFor={category} className="text-sm">{formatActivityName(category)}</Label>
                  <Input
                    id={category}
                    type="number"
                    step="0.5"
                    value={currentEntry.hours[category]?.toString() || ''}
                    onChange={(e) => handleHoursChange(category, e.target.value)}
                    placeholder="0.0"
                    className="mt-1"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Optional Reflection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Notes (Optional)</Label>
            <Textarea
              value={currentEntry.reflection}
              onChange={(e) => setCurrentEntry(prev => ({...prev, reflection: e.target.value}))}
              placeholder="Any additional notes about today's activities..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={isLogging}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLogging || Object.keys(currentEntry.activities).length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLogging ? 'Logging...' : 'Log Activities'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;