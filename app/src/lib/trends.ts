import { feedCache } from './cache';
import { Address } from 'viem';

export interface Trend {
  id: string;
  source: 'farcaster' | 'reddit' | 'twitter' | 'onchain';
  sourceId: string;
  title: string;
  description: string;
  url: string;
  score: number;
  timestamp: number;
  author?: Address;
  authorName?: string;
  authorFid?: number;
}

export interface TrendFeed {
  trends: Trend[];
  lastUpdated: number;
  sources: string[];
  total: number;
}

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;

async function fetchFarcasterTrends(limit: number = 20): Promise<Trend[]> {
  if (!NEYNAR_API_KEY) {
    console.warn('NEYNAR_API_KEY not configured, skipping Farcaster trends');
    return [];
  }

  try {
    const response = await fetch('https://api.neynar.com/v2/farcaster/trending', {
      headers: {
        'api_key': NEYNAR_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Farcaster trends API error:', response.status);
      return [];
    }

    const data = await response.json();
    const trends: Trend[] = [];

    if (data.casts && Array.isArray(data.casts)) {
      data.casts.forEach((cast: any) => {
        trends.push({
          id: 'fc-' + cast.hash,
          source: 'farcaster',
          sourceId: cast.hash,
          title: cast.text?.substring(0, 100) || 'Farcaster Cast',
          description: cast.text || '',
          url: 'https://warpcast.com/' + cast.author.username + '/' + cast.hash,
          score: cast.reactions?.likes || 0,
          timestamp: cast.timestamp * 1000,
          author: cast.author.verified_addresses?.eth_addresses?.[0] as Address | undefined,
          authorName: cast.author.display_name || cast.author.username,
          authorFid: cast.author.fid,
        });
      });
    }

    return trends;
  } catch (error) {
    console.error('Failed to fetch Farcaster trends:', error);
    return [];
  }
}

async function fetchRedditTrends(limit: number = 20): Promise<Trend[]> {
  try {
    const response = await fetch('https://www.reddit.com/r/ethereum/trending.json?limit=' + limit);
    if (!response.ok) {
      console.warn('Reddit trends API error:', response.status);
      return [];
    }

    const data = await response.json();
    const trends: Trend[] = [];

    if (data.data && data.data.children) {
      data.data.children.forEach((post: any) => {
        trends.push({
          id: 'rd-' + post.data.id,
          source: 'reddit',
          sourceId: post.data.id,
          title: post.data.title,
          description: post.data.selftext?.substring(0, 200) || '',
          url: 'https://reddit.com' + post.data.permalink,
          score: post.data.score || 0,
          timestamp: post.data.created_utc * 1000,
          authorName: post.data.author,
        });
      });
    }

    return trends;
  } catch (error) {
    console.error('Failed to fetch Reddit trends:', error);
    return [];
  }
}

async function fetchTwitterTrends(limit: number = 20): Promise<Trend[]> {
  if (!TWITTER_API_KEY) {
    console.warn('TWITTER_API_KEY not configured, skipping Twitter trends');
    return [];
  }

  try {
    const response = await fetch('https://api.twitter.com/2/trends/place/1', {
      headers: {
        'Authorization': 'Bearer ' + TWITTER_API_KEY,
      },
    });

    if (!response.ok) {
      console.warn('Twitter trends API error:', response.status);
      return [];
    }

    const data = await response.json();
    const trends: Trend[] = [];

    if (data[0]?.trends) {
      data[0].trends.forEach((trend: any) => {
        trends.push({
          id: 'tw-' + trend.id,
          source: 'twitter',
          sourceId: trend.id,
          title: trend.name,
          description: trend.description || '',
          url: trend.url || 'https://twitter.com/search?q=' + encodeURIComponent(trend.name),
          score: trend.tweet_volume || 0,
          timestamp: Date.now(),
        });
      });
    }

    return trends;
  } catch (error) {
    console.error('Failed to fetch Twitter trends:', error);
    return [];
  }
}

async function fetchOnchainTrends(limit: number = 20): Promise<Trend[]> {
  return [];
}

export async function fetchTrendFeed(limit: number = 50): Promise<TrendFeed> {
  const cacheKey = 'trend-feed-' + limit;
  return feedCache.get(cacheKey, async () => {
    const [farcaster, reddit, twitter, onchain] = await Promise.allSettled([
      fetchFarcasterTrends(limit / 4),
      fetchRedditTrends(limit / 4),
      fetchTwitterTrends(limit / 4),
      fetchOnchainTrends(limit / 4),
    ]);

    const allTrends: Trend[] = [];
    const sources: string[] = [];

    if (farcaster.status === 'fulfilled') {
      allTrends.push(...farcaster.value);
      if (farcaster.value.length > 0) sources.push('farcaster');
    }
    if (reddit.status === 'fulfilled') {
      allTrends.push(...reddit.value);
      if (reddit.value.length > 0) sources.push('reddit');
    }
    if (twitter.status === 'fulfilled') {
      allTrends.push(...twitter.value);
      if (twitter.value.length > 0) sources.push('twitter');
    }
    if (onchain.status === 'fulfilled') {
      allTrends.push(...onchain.value);
      if (onchain.value.length > 0) sources.push('onchain');
    }

    allTrends.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.timestamp - a.timestamp;
    });

    return {
      trends: allTrends.slice(0, limit),
      lastUpdated: Date.now(),
      sources,
      total: allTrends.length,
    };
  });
}

export async function getTrendById(id: string): Promise<Trend | null> {
  const feed = await fetchTrendFeed();
  return feed.trends.find(t => t.id === id) || null;
}

export async function getTrendsBySource(source: string, limit: number = 20): Promise<Trend[]> {
  const feed = await fetchTrendFeed(limit * 4);
  return feed.trends.filter(t => t.source === source).slice(0, limit);
}