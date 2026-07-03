import { NextRequest, NextResponse } from 'next/server';
import { fetchTrendFeed, getTrendById, getTrendsBySource } from '@/lib/trends';
import { feedRateLimiter } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const source = searchParams.get('source');
  const limit = searchParams.get('limit');
  const ip = request.ip ?? request.headers.get('x-real-ip') ?? 'unknown';

  const rateLimitResult = await feedRateLimiter.check(ip, 'trends');
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: rateLimitResult.retryAfter },
      { status: 429 }
    );
  }

  try {
    if (id) {
      const trend = await getTrendById(id);
      if (!trend) {
        return NextResponse.json({ error: 'Trend not found' }, { status: 404 });
      }
      return NextResponse.json(trend);
    }

    if (source) {
      const sourceLimit = limit ? parseInt(limit, 10) : 20;
      const trends = await getTrendsBySource(source, sourceLimit);
      return NextResponse.json({ trends, source, count: trends.length });
    }

    const feedLimit = limit ? parseInt(limit, 10) : 50;
    const feed = await fetchTrendFeed(feedLimit);
    return NextResponse.json(feed);
  } catch (error) {
    console.error('Trends API error:', error);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer ' + process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const feed = await fetchTrendFeed(50);
    return NextResponse.json({
      success: true,
      trends: feed.trends.length,
      lastUpdated: feed.lastUpdated,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to refresh trends' }, { status: 500 });
  }
}