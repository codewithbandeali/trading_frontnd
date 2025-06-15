import React from 'react';
import { Play, Pause, AlertTriangle } from 'lucide-react';

const strategies = [
  {
    name: 'BTC Momentum',
    status: 'active',
    profit: 12.4,
    trades: 145,
    winRate: 68,
  },
  {
    name: 'ETH Range',
    status: 'paused',
    profit: 8.2,
    trades: 89,
    winRate: 72,
  },
  {
    name: 'Stock RSI',
    status: 'warning',
    profit: -2.1,
    trades: 34,
    winRate: 45,
  },
];

export function ActiveStrategies() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Active Strategies</h2>
      <div className="space-y-4">
        {strategies.map((strategy) => (
          <div key={strategy.name} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {strategy.status === 'active' && <Play className="w-5 h-5 text-green-500" />}
              {strategy.status === 'paused' && <Pause className="w-5 h-5 text-gray-500" />}
              {strategy.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
              <div>
                <h3 className="font-medium">{strategy.name}</h3>
                <p className="text-sm text-gray-500">{strategy.trades} trades</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                strategy.profit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {strategy.profit > 0 ? '+' : ''}{strategy.profit}%
              </p>
              <p className="text-sm text-gray-500">Win rate: {strategy.winRate}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}