import React from 'react';
import { 
  Home, 
  Calculator, 
  Sparkles, 
  CheckSquare, 
  Menu
} from 'lucide-react';

/**
 * Mobile Tab Bar Component
 * Bottom navigation with 5 primary tabs
 * Touch-optimized with 44x44px minimum tap targets
 */
const MobileTabBar = ({ activeTab, onTabClick }) => {
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
      route: '/tools'
    },
    {
      id: 'coach',
      label: 'Coach',
      icon: Sparkles,
      route: '/dashboard?tab=coach',
      proOnly: true
    },
    {
      id: 'actions',
      label: 'Actions',
      icon: CheckSquare,
      route: '/dashboard?tab=actions',
      proOnly: true
    },
    {
      id: 'more',
      label: 'More',
      icon: Menu,
      route: null // Opens menu modal
    }
  ];

  return (
    <nav className="bg-white border-t border-gray-200" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
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
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
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
