import React, { useState } from 'react';
import { Plus, X, TrendingUp, MessageSquare } from 'lucide-react';

/**
 * Floating Action Button Component
 * Primary action button for adding new actions/goals on mobile
 * Fixed position above bottom tab navigation
 * Shows menu with Log Activity and Log Reflection options
 */
const QuickActionButton = ({ onClick }) => {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    {
      id: 'activity',
      label: 'Log Activity',
      icon: TrendingUp,
      action: () => {
        setShowMenu(false);
        onClick?.('activity');
      }
    },
    {
      id: 'reflection',
      label: 'Log a Reflection',
      icon: MessageSquare,
      action: () => {
        setShowMenu(false);
        onClick?.('reflection');
      }
    }
  ];

  if (showMenu) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowMenu(false)}
        />
        
        {/* Menu */}
        <div className="fixed bottom-24 right-6 z-50 flex flex-col space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="flex items-center space-x-3 bg-white text-gray-900 px-4 py-3 rounded-full shadow-lg hover:bg-gray-50 transition-all"
                style={{ minWidth: '200px', minHeight: '56px' }}
              >
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
          
          {/* Close button */}
          <button
            onClick={() => setShowMenu(false)}
            className="w-14 h-14 bg-gray-600 text-white rounded-full shadow-lg flex items-center justify-center ml-auto"
            style={{ minWidth: '56px', minHeight: '56px' }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </>
    );
  }

  return (
    <button
      onClick={() => setShowMenu(true)}
      className="
        fixed bottom-20 right-6 z-50
        w-14 h-14 
        bg-gradient-to-r from-primary to-secondary 
        hover:from-emerald-700 hover:to-emerald-800
        text-white rounded-full shadow-lg 
        flex items-center justify-center
        transition-all duration-200
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-primary/30
      "
      style={{ minWidth: '56px', minHeight: '56px' }} // Touch target minimum
      aria-label="Add new action or goal"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default QuickActionButton;
