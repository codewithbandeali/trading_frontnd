import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, TrendingUp, TrendingDown, Clock, Bookmark, BookmarkCheck,
  Share2, Filter, ChevronRight, AlertCircle, Play, Volume2,
  Eye, BarChart3, Globe, Newspaper, Bitcoin, DollarSign,
  Activity, Zap, Bell, X, Menu, ChevronDown, RefreshCw,
  ExternalLink
} from 'lucide-react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import clsx from 'clsx';
import { newsService } from '../services/newsApi';

// Interfaces
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image_url: string;
  author: string;
  published_at: string;
  source_name: string;
  categories: string[];
  time_ago: string;
  views_count: number;
  is_trending: boolean;
  is_featured: boolean;
  is_breaking: boolean;
}

interface MarketData {
  market_name: string;
  symbol: string;
  current_value: number;
  change_value: number;
  change_percent: number;
  volume: number;
  high_24h: number;
  low_24h: number;
}

interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
  icon: string;
  article_count: number;
}

interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Category Icons Mapping
const categoryIcons: Record<string, React.ComponentType<any>> = {
  crypto: Bitcoin,
  stocks: BarChart3,
  forex: DollarSign,
  commodities: Activity,
  economy: Globe,
  all: Newspaper,
};

export function Research() {
  // State Management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<NewsArticle[]>([]);
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([
    // Default categories
    { id: 0, name: 'All News', slug: 'all', color: '#3B82F6', icon: 'newspaper', article_count: 0 },
    { id: 1, name: 'Cryptocurrency', slug: 'crypto', color: '#F97316', icon: 'bitcoin', article_count: 0 },
    { id: 2, name: 'Stock Market', slug: 'stocks', color: '#10B981', icon: 'chart', article_count: 0 },
    { id: 3, name: 'Forex', slug: 'forex', color: '#8B5CF6', icon: 'dollar', article_count: 0 },
    { id: 4, name: 'Commodities', slug: 'commodities', color: '#EAB308', icon: 'gold', article_count: 0 },
    { id: 5, name: 'Economy', slug: 'economy', color: '#EF4444', icon: 'globe', article_count: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Auth token (from your auth context/store)
  const authToken = localStorage.getItem('access_token');

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await newsService.getCategories();
      // Handle both array and paginated responses
      const categoriesData = Array.isArray(response.data) ? response.data : (response.data.results || []);
      
      // Add 'all' category at the beginning
      const allCategories = [
        { id: 0, name: 'All News', slug: 'all', color: '#3B82F6', icon: 'newspaper', article_count: 0 },
        ...categoriesData
      ];
      
      setCategories(allCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Set default categories on error
      setCategories([
        { id: 0, name: 'All News', slug: 'all', color: '#3B82F6', icon: 'newspaper', article_count: 0 }
      ]);
    }
  };

  // Fetch News Articles
  const fetchNews = async (pageNum: number = 1, append: boolean = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    try {
      const params: any = {
        page: pageNum,
        page_size: 20,
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await newsService.getArticles(params);
      const responseData = response.data;
      if (append) {
        setArticles(prev => [...prev, ...responseData.results]);
      } else {
        setArticles(responseData.results);
      }

      setHasMore(responseData.next !== null);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch Featured Articles
  const fetchFeaturedArticles = async () => {
    try {
      const response = await newsService.getFeaturedArticles();
      setFeaturedArticles(response.data || []);
    } catch (error) {
      console.error('Error fetching featured articles:', error);
    }
  };

  // Fetch Breaking News
  const fetchBreakingNews = async () => {
    try {
      const response = await newsService.getBreakingNews();
      setBreakingNews(response.data || []);
    } catch (error) {
      console.error('Error fetching breaking news:', error);
    }
  };

  // Fetch Market Data
  const fetchMarketData = async () => {
    try {
      const response = await newsService.getMarketSnapshot();
      if (response.data && response.data.success) {
        setMarketData(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Don't crash the app on market data error
      setMarketData([]);
    }
  };

  // Refresh Latest News
  const refreshLatestNews = async () => {
    setRefreshing(true);
    try {
      await newsService.fetchLatestNews(true);
      // Refresh all data after fetching latest news
      await Promise.all([
        fetchNews(1),
        fetchFeaturedArticles(),
        fetchBreakingNews(),
        fetchMarketData()
      ]);
    } catch (error) {
      console.error('Error refreshing news:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Toggle Save Article
  const toggleSaveArticle = async (articleId: string) => {
    if (!authToken) {
      alert('Please login to save articles');
      return;
    }

    const newSavedArticles = new Set(savedArticles);
    
    try {
      if (savedArticles.has(articleId)) {
        await newsService.unsaveArticle(articleId);
        newSavedArticles.delete(articleId);
      } else {
        await newsService.saveArticle(articleId);
        newSavedArticles.add(articleId);
      }
      setSavedArticles(newSavedArticles);
    } catch (error) {
      console.error('Error saving/unsaving article:', error);
    }
  };

  // Load More Articles
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchNews(page + 1, true);
    }
  };

  // Chart Options for Market Analysis
  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 250,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      type: 'datetime',
      categories: marketData.slice(0, 5).map((_, i) => {
        const date = new Date();
        date.setHours(date.getHours() - (4 - i));
        return date.toISOString();
      }),
    },
    tooltip: {
      x: {
        format: 'HH:mm',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
  };

  const series = [{
    name: 'Market Trend',
    data: marketData.slice(0, 5).map(item => item.current_value),
  }];

  // Initial Load
  useEffect(() => {
    fetchCategories();
    fetchMarketData();
    fetchFeaturedArticles();
    fetchBreakingNews();
    
    // Set up interval for market data updates
    const marketInterval = setInterval(fetchMarketData, 60000); // Update every minute
    
    return () => clearInterval(marketInterval);
  }, []);

  // Load news when category or search changes
  useEffect(() => {
    fetchNews(1);
  }, [selectedCategory, searchQuery]);

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, hasMore, loadingMore]);

  // Market Ticker Component
  const MarketTicker = () => {
    if (marketData.length === 0) return null;
    
    return (
      <div className="bg-gray-900 text-white py-2 overflow-hidden">
        <div className="flex animate-scroll-left">
          {marketData.concat(marketData).map((item, index) => (
            <div key={index} className="flex items-center mx-6 whitespace-nowrap">
              <span className="font-medium">{item.market_name}</span>
              <span className="mx-2">${item.current_value.toFixed(2)}</span>
              <span className={`flex items-center ${item.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.change_percent >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {Math.abs(item.change_percent).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Breaking News Bar
  const BreakingNewsBar = () => {
    if (breakingNews.length === 0) return null;
    
    return (
      <div className="bg-red-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="flex items-center mr-4">
            <Zap className="w-5 h-5 mr-2 animate-pulse" />
            <span className="font-bold uppercase text-sm">Breaking</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-scroll-left flex">
              {breakingNews.map((news, index) => (
                <a 
                  key={index} 
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-8 hover:underline"
                >
                  <span className="font-medium">{news.title}</span>
                  <span className="text-red-200 ml-2 text-sm">• {news.time_ago}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Article Card Component
  const ArticleCard = ({ article }: { article: NewsArticle }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
      <div className="aspect-video rounded-t-xl overflow-hidden">
        <img
          src={article.image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'}
          alt={article.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {article.is_trending && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {article.categories.map((cat, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
              {cat}
            </span>
          ))}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{article.source_name}</span>
            <span>•</span>
            <span>{article.time_ago}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {article.views_count}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveArticle(article.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {savedArticles.has(article.id) ? (
                <BookmarkCheck className="w-5 h-5 text-blue-600" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Market Ticker */}
      {marketData.length > 0 && <MarketTicker />}
      
      {/* Breaking News */}
      <BreakingNewsBar />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Market News & Research</h1>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={refreshLatestNews}
                disabled={refreshing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug] || Newspaper;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all',
                    selectedCategory === category.slug
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                  {category.article_count > 0 && (
                    <span className="ml-1 text-xs opacity-75">({category.article_count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Analysis */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Market Analysis</h2>
              {marketData.length > 0 ? (
                <>
                  <div className="mb-6">
                    <ReactApexChart
                      options={chartOptions}
                      series={series}
                      type="area"
                      height={250}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {marketData.slice(0, 4).map((item) => (
                      <div key={item.symbol} className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600">{item.market_name}</div>
                        <div className="text-lg font-semibold">${item.current_value.toFixed(2)}</div>
                        <div className={`text-sm flex items-center gap-1 ${item.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change_percent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(item.change_percent).toFixed(2)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Loading market data...</p>
                </div>
              )}
            </div>
            
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Featured Stories</h2>
                <div className="grid gap-4">
                  {featuredArticles.slice(0, 3).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* News Feed */}
          <div>
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Latest News</h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
                  </div>
                ) : articles.length > 0 ? (
                  <div className="space-y-6 max-h-[800px] overflow-y-auto">
                    {articles.map((article) => (
                      <div key={article.id} className="group cursor-pointer border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                        <div className="aspect-video rounded-lg overflow-hidden mb-3">
                          <img
                            src={article.image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                            <span>{article.source_name}</span>
                            <span>{article.time_ago}</span>
                          </div>
                          <h3 className="font-medium mb-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{article.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              Read more <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => toggleSaveArticle(article.id)}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              {savedArticles.has(article.id) ? (
                                <BookmarkCheck className="w-4 h-4" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {loadingMore && (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
                      </div>
                    )}
                    
                    {!hasMore && articles.length > 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <p>No more articles to load</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No articles found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
