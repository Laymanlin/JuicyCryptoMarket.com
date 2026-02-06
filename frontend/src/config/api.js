// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  verify: `${API_BASE_URL}/api/auth/verify`,
  
  // Demo account endpoints
  demoLogin: `${API_BASE_URL}/api/demo-login`,
  account: `${API_BASE_URL}/api/account`,
  logout: `${API_BASE_URL}/api/logout`,
  trade: `${API_BASE_URL}/api/trade`,
  marketPrices: `${API_BASE_URL}/api/market-prices`,
  
  // Health check
  health: `${API_BASE_URL}/api/health`,
};

export default API_ENDPOINTS;
