import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChevronRight } from 'lucide-react';

/**
 * Mobile Card Component
 * Reusable card wrapper for mobile dashboard with consistent styling
 * Touch-optimized with 44x44px minimum tap targets
 */
const MobileCard = ({ 
  title, 
  icon: Icon, 
  children, 
  onClick, 
  badge,
  className = '',
  headerAction
}) => {
  const isClickable = !!onClick;

  return (
    <Card 
      className={`
        bg-white shadow-sm border-gray-200 
        ${isClickable ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            )}
            <CardTitle className="text-base font-semibold text-gray-900">
              {title}
            </CardTitle>
          </div>
          
          <div className="flex items-center space-x-2">
            {badge && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {badge}
              </span>
            )}
            {headerAction || (isClickable && (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default MobileCard;
