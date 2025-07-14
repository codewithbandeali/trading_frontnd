import axios from "axios";

// Use the same base URL as your main API
const API = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// attach the access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ► refresh on 401 and retry once
let isRefreshing = false;
API.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      localStorage.getItem("refresh_token")
    ) {
      original._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await API.post("auth/refresh/", {
            refresh: localStorage.getItem("refresh_token"),
          });
          localStorage.setItem("access_token", data.access);
        } finally {
          isRefreshing = false;
        }
      }
      original.headers.Authorization = `Bearer ${localStorage.getItem(
        "access_token"
      )}`;
      return API(original);
    }
    return Promise.reject(error);
  }
);

// News API Service
export const newsService = {
  // Articles
  getArticles: (params?: any) => 
    API.get('research/articles/', { params }),
  
  getArticle: (id: string) => 
    API.get(`research/articles/${id}/`),
  
  getTrendingArticles: () => 
    API.get('research/articles/trending/'),
  
  getFeaturedArticles: () => 
    API.get('research/articles/featured/'),
  
  getBreakingNews: () => 
    API.get('research/articles/breaking/'),
  
  saveArticle: (id: string) => 
    API.post(`research/articles/${id}/save/`),
  
  unsaveArticle: (id: string) => 
    API.delete(`research/articles/${id}/unsave/`),
  
  // Categories
  getCategories: () => 
    API.get('research/categories/'),
  
  // Market Data
  getMarketSnapshot: (category?: string) => 
    API.get('research/market-snapshot/', { params: { category } }),
  
  getMarketMovers: (type: 'gainers' | 'losers' = 'gainers') => 
    API.get('research/market-movers/', { params: { type } }),
  
  // News Fetching
  fetchLatestNews: (forceRefresh: boolean = false) => 
    API.get('research/fetch-news/', { params: { force_refresh: forceRefresh } }),
  
  // User Preferences
  getPreferences: () => 
    API.get('research/preferences/'),
  
  updatePreferences: (data: any) => 
    API.put('research/preferences/', data),
  
  // Saved Articles
  getSavedArticles: () => 
    API.get('research/saved/'),
  
  // Statistics
  getNewsStats: () => 
    API.get('research/stats/'),
};

// Utility functions
export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default API;
