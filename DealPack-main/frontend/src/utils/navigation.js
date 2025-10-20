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