import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Mobile Back Button Component
 * Shows at top of panels to navigate back to overview
 */
const MobileBackButton = ({ title = "Back" }) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-3">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-primary hover:text-primary/80 transition-colors"
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="font-medium">{title}</span>
      </button>
    </div>
  );
};

export default MobileBackButton;
