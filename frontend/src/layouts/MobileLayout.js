import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calculator, 
  Sparkles, 
  CheckSquare, 
  Menu,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Mobile Layout Component
 * Provides bottom tab navigation and mobile-optimized layout for dashboard
 * Phase 2: Placeholder implementation
 * Phase 3: Full implementation with tab switching
 */
const MobileLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabClick = (tabId, route) => {
    setActiveTab(tabId);
    if (route) {
      navigate(route);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Home className="w-5 h-5" />,
      route: '/dashboard'
    },
    {
      id: 'calculators',
      label: 'Calculators',
      icon: <Calculator className="w-5 h-5" />,
      route: null // Opens menu in Phase 3
    },
    {
      id: 'coach',
      label: 'Coach',
      icon: <Sparkles className="w-5 h-5" />,
      route: null // Links to AI Coach in Phase 3
    },
    {
      id: 'actions',
      label: 'Actions',
      icon: <CheckSquare className="w-5 h-5" />,
      route: null // Opens Action Tracker in Phase 3
    },
    {
      id: 'more',
      label: 'More',
      icon: <Menu className="w-5 h-5" />,
      route: null // Opens menu in Phase 3
    }
  ];

  return (
    <div className="mobile-layout h-screen flex flex-col bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-primary text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <img 
            src={`${process.env.REACT_APP_ASSETS_URL}/job_agent-portal-27/artifacts/azdcmpew_Logo_with_brown_background-removebg-preview.png`}
            alt="I Need Numbers"
            className="h-8 w-auto brightness-0 invert"
          />
          <span className="font-bold text-lg">I NEED NUMBERS</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {/* Phase 2: Outlet renders DashboardPage content */}
        {/* Phase 3: Will render MobileDashboard component */}
        <Outlet />
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.route)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ minWidth: '44px', minHeight: '44px' }} // Touch target minimum
            >
              <div className="mb-1">
                {tab.icon}
              </div>
              <span className="text-xs font-medium">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Safe area for iOS home indicator */}
      <style jsx>{`
        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};

export default MobileLayout;
