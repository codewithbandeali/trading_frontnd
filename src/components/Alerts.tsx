import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, TrendingDown, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface Alert {
  id: string;
  type: 'price' | 'signal' | 'risk' | 'execution';
  title: string;
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
  priority: 'high' | 'medium' | 'low';
  category: 'crypto' | 'stocks' | 'forex';
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'price',
    title: 'BTC Price Alert',
    message: 'Bitcoin has reached your target price of $50,000',
    timestamp: '2 minutes ago',
    status: 'success',
    priority: 'high',
    category: 'crypto'
  },
  {
    id: '2',
    type: 'signal',
    title: 'New Trading Signal',
    message: 'Buy signal detected for ETH/USD',
    timestamp: '15 minutes ago',
    status: 'info',
    priority: 'medium',
    category: 'crypto'
  },
  {
    id: '3',
    type: 'risk',
    title: 'Margin Warning',
    message: 'Your margin level is approaching the minimum requirement',
    timestamp: '1 hour ago',
    status: 'warning',
    priority: 'high',
    category: 'stocks'
  },
  {
    id: '4',
    type: 'execution',
    title: 'Trade Executed',
    message: 'Buy order for 0.5 BTC executed at $48,500',
    timestamp: '2 hours ago',
    status: 'success',
    priority: 'low',
    category: 'crypto'
  },
];

const getAlertIcon = (type: Alert['type'], status: Alert['status']) => {
  const className = clsx(
    'w-5 h-5',
    status === 'success' ? 'text-green-500' :
    status === 'warning' ? 'text-yellow-500' :
    'text-blue-500'
  );

  switch (type) {
    case 'price':
      return status === 'success' ? <TrendingUp className={className} /> : <TrendingDown className={className} />;
    case 'signal':
      return <Clock className={className} />;
    case 'risk':
      return <AlertTriangle className={className} />;
    case 'execution':
      return <CheckCircle className={className} />;
    default:
      return <AlertTriangle className={className} />;
  }
};

export function Alerts() {
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  });

  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const filteredAlerts = alerts.filter(alert => {
    if (filters.status !== 'all' && alert.status !== filters.status) return false;
    if (filters.priority !== 'all' && alert.priority !== filters.priority) return false;
    if (filters.category !== 'all' && alert.category !== filters.category) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Alerts</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Mark all as read
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Configure Alerts
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="crypto">Crypto</option>
                  <option value="stocks">Stocks</option>
                  <option value="forex">Forex</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-end ml-auto">
                <button
                  onClick={() => {
                    setFilters({ status: 'all', priority: 'all', category: 'all' });
                    setDateRange({ start: '', end: '' });
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type, alert.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {alert.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={clsx(
                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                            alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                            alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          )}>
                            {alert.priority}
                          </span>
                          <span className="text-xs text-gray-500">{alert.category}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{alert.timestamp}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}