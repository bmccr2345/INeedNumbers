import React from 'react';
import { Plus } from 'lucide-react';

/**
 * Floating Action Button Component
 * Primary action button for adding new actions/goals on mobile
 * Fixed position above bottom tab navigation
 */
const QuickActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
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
