'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trend } from '@/lib/trends';

export interface TrendFeedProps {
  limit?: number;
  source?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function TrendFeed({
  limit = 20,
  source,
  autoRefresh = true,
  refreshInterval = 300000,
}: TrendFeedProps) {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchTrends = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let url = '/api/trends?limit=' + limit;
      if (source) {
        url += '&source=' + source;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
      }

      const data = await response.json();
      if (source) {
        setTrends(data.trends || []);
      } else {
        setTrends(data.trends || []);
        setLastUpdated(data.lastUpdated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setTrends([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit, source]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchTrends();
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchTrends]);

  if (isLoading && trends.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        <p>Error: {error}</p>
        <button
          onClick={fetchTrends}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No trends found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {source ? source.charAt(0).toUpperCase() + source.slice(1) + ' Trends' : 'Trending Now'}
        </h2>
        {lastUpdated && (
          <p className="text-sm text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trends.map((trend) => (
          <div
            key={trend.id}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {trend.source}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(trend.timestamp).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{trend.title}</h3>
            {trend.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{trend.description}</p>
            )}

            {trend.authorName && (
              <div className="flex items-center gap-2 mb-3">
                {trend.author && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {trend.author.slice(0, 6)}...{trend.author.slice(-4)}
                  </span>
                )}
                <span className="text-sm text-gray-500">by {trend.authorName}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                {trend.score}
              </span>
              {trend.url && (
                <a
                  href={trend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-xs font-medium"
                >
                  View source
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendFeed;