import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Configure axios defaults
  useEffect(() => {
    const token = Cookies.get('access_token') || localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('access_token') || localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    try {
      // Demo mode check
      if (token === 'demo-token') {
        const demoUser = {
          id: 'demo-user',
          email: 'demo@demo.com', 
          plan: 'PRO',
          name: 'Demo User',
          role: 'user'
        };
        setUser(demoUser);
        setLoading(false);
        return;
      }
      
      // Use real backend API for authentication check
      try {
        const response = await axios.get(`${backendUrl}/api/auth/me`);
        const user = response.data;
        
        // For master admin, check security setup status
        if (user.role === 'master_admin') {
          const hasChangedPassword = localStorage.getItem('admin_password_changed') === 'true';
          const hasSetup2FA = localStorage.getItem('admin_2fa_setup') === 'true';
          
          user.requiresPasswordReset = !hasChangedPassword;
          user.requires2FA = !hasSetup2FA;
          user.firstLogin = !hasChangedPassword || !hasSetup2FA;
        }
        
        setUser(user);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token
        Cookies.remove('access_token');
        delete axios.defaults.headers.common['Authorization'];
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      // Use real backend API for all authentication (including demo)
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
        remember_me: rememberMe
      });
      
      if (response.data && response.data.access_token) {
        const { access_token, user } = response.data;
        
        // Set real token in both cookies and localStorage for maximum compatibility
        Cookies.set('access_token', access_token, {
          expires: rememberMe ? 30 : 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        
        // Also store in localStorage for Bearer token authentication
        localStorage.setItem('access_token', access_token);
        
        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // For master admin, check security setup status
        if (user.role === 'master_admin') {
          const hasChangedPassword = localStorage.getItem('admin_password_changed') === 'true';
          const hasSetup2FA = localStorage.getItem('admin_2fa_setup') === 'true';
          
          user.requiresPasswordReset = !hasChangedPassword;
          user.requires2FA = !hasSetup2FA;
          user.firstLogin = !hasChangedPassword || !hasSetup2FA;
        }
        
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (email, password, fullName = '') => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/register`, {
        email,
        password,
        full_name: fullName
      });

      // Auto-login after registration
      const loginResult = await login(email, password, false);
      return loginResult;
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    localStorage.removeItem('access_token');  // Also clear from localStorage
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const deleteAccount = async (confirmation) => {
    try {
      await axios.delete(`${backendUrl}/api/auth/delete-account`, {
        data: { confirmation }
      });
      
      logout();
      return { success: true };
    } catch (error) {
      console.error('Account deletion failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Account deletion failed. Please try again.' 
      };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const createCheckoutSession = async (plan) => {
    try {
      const response = await axios.post(`${backendUrl}/api/stripe/checkout`, {
        plan,
        origin_url: window.location.origin
      });
      
      return { success: true, url: response.data.url };
    } catch (error) {
      console.error('Checkout session creation failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to create checkout session.' 
      };
    }
  };

  const createCustomerPortal = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/stripe/portal`);
      return { success: true, url: response.data.url };
    } catch (error) {
      console.error('Customer portal creation failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to access billing portal.' 
      };
    }
  };

  const exportUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/export`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Data export failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Data export failed.' 
      };
    }
  };

  // Get plan limits
  const getPlanLimits = (plan) => {
    switch (plan) {
      case 'STARTER':
        return { deals: 10, portfolios: 1, branding: true };
      case 'PRO':
        return { deals: -1, portfolios: -1, branding: true }; // -1 = unlimited
      default:
        return { deals: 0, portfolios: 0, branding: false };
    }
  };

  // Check if user can perform action
  const canPerformAction = (action, plan = user?.plan) => {
    const limits = getPlanLimits(plan);
    
    switch (action) {
      case 'save_deal':
        return limits.deals !== 0 && (limits.deals === -1 || (user?.deals_count || 0) < limits.deals);
      case 'branded_pdf':
        return limits.branding;
      case 'share_deal':
        return limits.deals !== 0;
      case 'create_portfolio':
        return limits.portfolios !== 0;
      default:
        return true;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    deleteAccount,
    refreshUser,
    createCheckoutSession,
    createCustomerPortal,
    exportUserData,
    isAuthenticated: !!user,
    getPlanLimits,
    canPerformAction
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};