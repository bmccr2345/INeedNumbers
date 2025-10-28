import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, 
  Calculator, 
  Wallet,
  CheckSquare, 
  Menu
} from 'lucide-react';

/**
 * Mobile Tab Bar Component
 * Bottom navigation with 5 primary tabs (Coach removed for mobile)
 * Touch-optimized with 44x44px minimum tap targets
 * Phase 4: Full implementation with route awareness
 */
const MobileTabBar = ({ activeTab, onTabClick }) => {
  const location = useLocation();
  
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      route: '/dashboard'
    },
    {
      id: 'calculators',
      label: 'Calculators',
      icon: Calculator,
      route: null // Opens calculator menu
    },
    {
      id: 'finances',
      label: 'Finances',
      icon: Wallet,
      route: '/dashboard?panel=pnl'
    },
    {
      id: 'actions',
      label: 'Actions',
      icon: CheckSquare,
      route: '/dashboard',
      proOnly: true
    },
    {
      id: 'more',
      label: 'More',
      icon: Menu,
      route: null // Opens more menu
    }
  ];

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || 
                          (tab.route && location.pathname === tab.route);
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id, tab.route)}
              className={`
                flex flex-col items-center justify-center flex-1 h-full 
                transition-colors relative
                ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}
              `}
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
              )}
              
              <div className="mb-1 relative">
                <Icon className="w-5 h-5" />
                {tab.proOnly && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" 
                       title="PRO feature" />
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;
