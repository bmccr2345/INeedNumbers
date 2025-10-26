import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MobileDashboard from '../pages/MobileDashboard';
import MobileTabBar from '../components/mobile/MobileTabBar';

/**
 * Mobile Layout Component
 * Provides bottom tab navigation and mobile-optimized layout for dashboard
 * Phase 3: Full implementation with MobileDashboard
 */
const MobileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const handleTabClick = (tabId, route) => {
    setActiveTab(tabId);
    
    if (tabId === 'more') {
      // TODO Phase 4: Open "More" menu modal
      console.log('Open More menu');
      return;
    }
    
    if (route) {
      navigate(route);
    }
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      route: '/dashboard'
    },
    {
      id: 'calculators',
      label: 'Calculators',
      route: '/tools'
    },
    {
      id: 'coach',
      label: 'Coach',
      route: '/dashboard'
    },
    {
      id: 'actions',
      label: 'Actions',
      route: '/dashboard'
    },
    {
      id: 'more',
      label: 'More',
      route: null
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
        {/* Phase 3: Render MobileDashboard for overview, pass through for other routes */}
        {location.pathname === '/dashboard' && activeTab === 'overview' ? (
          <MobileDashboard />
        ) : (
          <Outlet />
        )}
      </main>

      {/* Bottom Tab Navigation */}
      <MobileTabBar activeTab={activeTab} onTabClick={handleTabClick} />

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
