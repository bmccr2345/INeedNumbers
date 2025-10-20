import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

/**
 * RBAC (Role-Based Access Control) Protection Component
 * Restricts access based on user roles
 */
const RoleProtected = ({ 
  children, 
  requiredRole, 
  requiredRoles = [], 
  fallback = null,
  showUnauthorized = true 
}) => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    if (fallback) return fallback;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span>Authentication Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You must be logged in to access this area.
            </p>
            <a 
              href="/auth/login" 
              className="text-primary hover:text-secondary underline"
            >
              Sign in to continue
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine required roles
  const roles = requiredRole ? [requiredRole] : requiredRoles;
  
  // Check if user has required role
  const hasAccess = roles.length === 0 || roles.includes(user.role);

  if (!hasAccess) {
    if (fallback) return fallback;
    
    if (!showUnauthorized) return null;
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Access Denied</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this area.
            </p>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <p><strong>Your role:</strong> {user.role || 'none'}</p>
              <p><strong>Required:</strong> {roles.join(' or ')}</p>
            </div>
            <div className="mt-4">
              <a 
                href="/dashboard" 
                className="text-primary hover:text-secondary underline"
              >
                Return to Dashboard
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
};

/**
 * Hook for checking roles in components
 */
export const useRole = () => {
  const { user } = useAuth();
  
  const hasRole = (role) => user?.role === role;
  const hasAnyRole = (roles) => roles.includes(user?.role);
  const isMasterAdmin = () => user?.role === 'master_admin';
  const isAdmin = () => ['master_admin', 'admin'].includes(user?.role);
  
  return {
    userRole: user?.role,
    hasRole,
    hasAnyRole,
    isMasterAdmin,
    isAdmin
  };
};

export default RoleProtected;