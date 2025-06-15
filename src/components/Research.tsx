import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Download, History, ExternalLink } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import clsx from 'clsx';

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
    categories: [
      '2024-01-01T00:00:00.000Z',
      '2024-02-01T00:00:00.000Z',
      '2024-03-01T00:00:00.000Z',
      '2024-04-01T00:00:00.000Z',
      '2024-05-01T00:00:00.000Z',
    ],
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy',
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

const series = [
  {
    name: 'Market Trend',
    data: [31, 40, 28, 51, 42],
  },
];

const newsData = [
  {
    id: 1,
    title: "Bitcoin Surges Past $60,000 as Institutional Interest Grows",
    source: "CryptoNews",
    time: "2 hours ago",
    image: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    excerpt: "Bitcoin has reached a new milestone as institutional investors continue to show strong interest in cryptocurrency investments...",
    category: "crypto"
  },
  {
    id: 2,
    title: "Ethereum 2.0 Upgrade Shows Promising Results",
    source: "BlockchainDaily",
    time: "4 hours ago",
    image: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    excerpt: "The latest Ethereum network upgrade has demonstrated significant improvements in transaction speeds and energy efficiency...",
    category: "crypto"
  },
  {
    id: 3,
    title: "New Crypto Regulations Proposed by SEC",
    source: "CryptoInsider",
    time: "6 hours ago",
    image: "https://images.pexels.com/photos/7567529/pexels-photo-7567529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    excerpt: "The Securities and Exchange Commission has proposed new regulations for cryptocurrency trading platforms...",
    category: "crypto"
  },
  {
    id: 4,
    title: "Tesla Stock Soars After Strong Earnings Report",
    source: "StockMarketNews",
    time: "8 hours ago",
    image: "https://images.pexels.com/photos/2394446/pexels-photo-2394446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    excerpt: "Tesla's stock price jumped 15% following better-than-expected quarterly earnings...",
    category: "stocks"
  },
  {
    id: 5,
    title: "Gold Prices Hit New High Amid Global Uncertainty",
    source: "CommoditiesDaily",
    time: "10 hours ago",
    image: "https://images.pexels.com/photos/47047/gold-ingots-golden-treasure-47047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    excerpt: "Gold prices continue to rise as investors seek safe-haven assets...",
    category: "commodities"
  },
  {
    id: 6,
    title: "Dollar Strengthens Against Major Currencies",
    source: "ForexWatch",
    time: "12 hours ago",
    image: "https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    excerpt: "The US dollar gained ground against the euro and yen following positive economic data...",
    category: "forex"
  }
];

const newsCategories = [
  { id: 'all', label: 'All News' },
  { id: 'crypto', label: 'Cryptocurrency' },
  { id: 'stocks', label: 'Stock Market' },
  { id: 'forex', label: 'Forex' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'economy', label: 'Economy' },
];

export function Research() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsSearch, setNewsSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const filteredNews = newsData.filter(news => {
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    const matchesSearch = news.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(newsSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const loadMoreNews = () => {
    setLoading(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        loadMoreNews();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Market Analysis</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  Based on recent market data and AI analysis, we observe a bullish trend in the cryptocurrency market.
                  Bitcoin's price action shows strong support levels and increasing volume, indicating potential upward momentum.
                </p>
                <div className="mb-6">
                  <ReactApexChart
                    options={chartOptions}
                    series={series}
                    type="area"
                    height={250}
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Key Findings</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Strong support level established at $45,000</li>
                  <li>Increasing institutional interest based on on-chain metrics</li>
                  <li>Positive market sentiment from social media analysis</li>
                  <li>Technical indicators suggesting potential breakout</li>
                </ul>
              </div>
            </div>
          </div>

          {/* News Feed */}
          <div className="lg:w-1/3">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">News Impact</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search news..."
                      value={newsSearch}
                      onChange={(e) => setNewsSearch(e.target.value)}
                    />
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                  {newsCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={clsx(
                        'px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors',
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  {filteredNews.slice(0, page * 3).map((news) => (
                    <div key={news.id} className="group cursor-pointer border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="aspect-video rounded-lg overflow-hidden mb-3">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                          <span>{news.source}</span>
                          <span>{news.time}</span>
                        </div>
                        <h3 className="font-medium mb-2 group-hover:text-blue-600 transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-sm text-gray-500">{news.excerpt}</p>
                        <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          Read more <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {loading && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}