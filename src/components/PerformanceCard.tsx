import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

interface PerformanceCardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
}

export function PerformanceCard({ title, value, change, trend }: PerformanceCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        <div className={clsx(
          "flex items-center text-sm",
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        )}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="ml-1">{change}%</span>
        </div>
      </div>
    </div>
  );
}