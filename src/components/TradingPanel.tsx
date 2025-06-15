import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Settings } from 'lucide-react';
import { clsx } from 'clsx';

interface TradeFormData {
  asset: string;
  type: 'buy' | 'sell';
  amount: string;
  price: string;
  stopLoss: string;
  takeProfit: string;
}

const initialFormData: TradeFormData = {
  asset: 'BTC/USD',
  type: 'buy',
  amount: '',
  price: '',
  stopLoss: '',
  takeProfit: ''
};

const availableAssets = [
  { symbol: 'BTC/USD', name: 'Bitcoin' },
  { symbol: 'ETH/USD', name: 'Ethereum' },
  { symbol: 'SOL/USD', name: 'Solana' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Google' },
  { symbol: 'TSLA', name: 'Tesla' }
];

export function TradingPanel() {
  const [formData, setFormData] = useState<TradeFormData>(initialFormData);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [leverage, setLeverage] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your trading API
    console.log('Trade submitted:', formData);
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const price = parseFloat(formData.price) || 0;
    return (amount * price * leverage).toFixed(2);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Trading Terminal</h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset
            </label>
            <select
              name="asset"
              value={formData.asset}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {availableAssets.map(asset => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.symbol} - {asset.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'buy' }))}
                className={clsx(
                  'py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2',
                  formData.type === 'buy'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                <TrendingUp className="w-4 h-4" />
                Buy
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'sell' }))}
                className={clsx(
                  'py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2',
                  formData.type === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                <TrendingDown className="w-4 h-4" />
                Sell
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
              />
              <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <div className="relative">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
              />
              <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {showAdvanced && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stop Loss
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="stopLoss"
                    value={formData.stopLoss}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                  />
                  <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Take Profit
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="takeProfit"
                    value={formData.takeProfit}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                  />
                  <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leverage: {leverage}x
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Total Value</span>
            <span className="text-lg font-semibold">${calculateTotal()}</span>
          </div>

          {leverage > 1 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg mb-4">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm">
                Trading with {leverage}x leverage increases both potential profits and losses.
              </p>
            </div>
          )}

          <button
            type="submit"
            className={clsx(
              'w-full py-3 px-4 rounded-lg font-medium text-white',
              formData.type === 'buy'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            )}
          >
            {formData.type === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
          </button>
        </div>
      </form>
    </div>
  );
}