'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketInsightsProps {
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export default function MarketInsights({ totalCount = 0, currentPage = 1, totalPages = 1 }: MarketInsightsProps) {
  const avgPrice = 685000;
  const marketChange = -2.3;
  const isMarketPositive = marketChange > 0;

  return (
    <div className="flex items-center gap-6">
      {/* Property Count */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Properties</span>
        <span className="text-lg font-semibold text-gray-900">{totalCount.toLocaleString()}</span>
        {totalPages > 1 && (
          <span className="text-sm text-gray-500">
            (Page {currentPage} of {totalPages})
          </span>
        )}
      </div>

      {/* Average Price */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">Avg</span>
        <span className="text-sm font-medium text-gray-900">${(avgPrice / 1000).toFixed(0)}K</span>
      </div>

      {/* Market Change */}
      <div className="flex items-center gap-2">
        {isMarketPositive ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
        <span className="text-sm text-gray-600">Market</span>
        <span className={`text-sm font-medium ${
          isMarketPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isMarketPositive ? '+' : ''}{marketChange}%
        </span>
      </div>
    </div>
  );
}
