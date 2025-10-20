// Navigation utility functions for authenticated vs unauthenticated users

/**
 * Get the appropriate home route based on authentication status
 * @param {Object} user - User object from AuthContext
 * @returns {string} - Route path
 */
export const getHomeRoute = (user) => {
  return user ? '/dashboard' : '/';
};

/**
 * Navigate to home based on authentication status
 * @param {Function} navigate - React Router navigate function
 * @param {Object} user - User object from AuthContext
 * @param {Object} options - Navigation options (replace, state, etc.)
 */
export const navigateToHome = (navigate, user, options = {}) => {
  const route = getHomeRoute(user);
  navigate(route, options);
};

/**
 * Get the appropriate route when user clicks "Back to Tools"
 * For logged-in Starter/Pro users: go to dashboard
 * For others: go to tools page
 * @param {Object} user - User object from AuthContext
 * @returns {string} - Route path
 */
export const getBackToToolsRoute = (user) => {
  // Check if user is logged in and has Starter or Pro plan
  if (user && (user.plan === 'STARTER' || user.plan === 'PRO')) {
    return '/dashboard';
  }
  return '/tools';
};

/**
 * Navigate back from calculator based on authentication and plan status
 * @param {Function} navigate - React Router navigate function
 * @param {Object} user - User object from AuthContext
 * @param {Object} options - Navigation options (replace, state, etc.)
 */
export const navigateBackFromCalculator = (navigate, user, options = {}) => {
  const route = getBackToToolsRoute(user);
  navigate(route, options);
};