import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  DollarSign, 
  Home,
  Calendar,
  FileText,
  TrendingUp,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

/**
 * Mobile Calculator Menu Modal
 * Quick access to all calculators from mobile
 * Accessed from "Calculators" tab
 */
const MobileCalculatorMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const calculators = [
    {
      id: 'commission',
      name: 'Commission Split',
      description: 'Calculate commission splits and payouts',
      icon: DollarSign,
      route: '/tools/commission-split',
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 'net-sheet',
      name: 'Seller Net Sheet',
      description: 'Estimate seller proceeds from sale',
      icon: FileText,
      route: '/tools/net-sheet',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'affordability',
      name: 'Affordability Calculator',
      description: 'Determine buyer purchasing power',
      icon: Home,
      route: '/tools/affordability',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'closing-date',
      name: 'Closing Date Calculator',
      description: 'Calculate transaction timelines',
      icon: Calendar,
      route: '/tools/closing-date',
      color: 'bg-orange-100 text-orange-700'
    },
    {
      id: 'investor',
      name: 'Investor Deal Calculator',
      description: 'Analyze investment property deals',
      icon: TrendingUp,
      route: '/calculator',
      color: 'bg-indigo-100 text-indigo-700'
    }
  ];

  const handleCalculatorClick = (route) => {
    navigate(route);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-30 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Content */}
      <div className="fixed inset-0 z-40 bg-white flex flex-col" style={{ paddingBottom: '64px' }}>
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calculator className="w-6 h-6" />
          <h2 className="text-xl font-bold">Calculators</h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close calculator menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Subtitle */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          Choose a calculator to run your numbers
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <button
                key={calc.id}
                onClick={() => handleCalculatorClick(calc.route)}
                className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all text-left"
                style={{ minHeight: '80px' }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${calc.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {calc.name}
                      </h3>
                      {calc.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {calc.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {calc.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Tip */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <p className="text-sm font-medium text-blue-900 mb-1">
            💡 Quick Tip
          </p>
          <p className="text-xs text-blue-700">
            Save your calculations to access them later from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileCalculatorMenu;
