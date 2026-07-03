import { NextRequest, NextResponse } from 'next/server';
import { Address } from 'viem';
import { getFarcasterUserByAddress, getFarcasterUserByFid, verifyNeynarSignature } from '@/lib/neynar';
import { RateLimiter } from '@/lib/rate-limit';

const neynarRateLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 20 });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address') as Address | null;
  const fid = searchParams.get('fid');
  const trending = searchParams.get('trending');
  const ip = request.ip ?? request.headers.get('x-real-ip') ?? 'unknown';

  const rateLimitResult = await neynarRateLimiter.check(ip, 'neynar');
  if (!rateLimitResult.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    if (trending === 'true') {
      const client = (await import('@neynar/nodejs-sdk')).NeynarAPIClient;
      const neynarClient = new client(process.env.NEYNAR_API_KEY!);
      const casts = await neynarClient.fetchTrendingCasts(10);
      return NextResponse.json({ casts: casts.casts || [] });
    }

    if (address) {
      const user = await getFarcasterUserByAddress(address);
      if (!user) {
        return NextResponse.json({ error: 'Farcaster user not found for address' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    if (fid) {
      const fidNum = parseInt(fid, 10);
      if (isNaN(fidNum)) {
        return NextResponse.json({ error: 'Invalid FID' }, { status: 400 });
      }
      const user = await getFarcasterUserByFid(fidNum);
      if (!user) {
        return NextResponse.json({ error: 'Farcaster user not found for FID' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    return NextResponse.json(
      { error: 'Please provide address, fid, or trending=true parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Neynar API error:', error);
    return NextResponse.json({ error: 'Failed to fetch Farcaster data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-real-ip') ?? 'unknown';

  const rateLimitResult = await neynarRateLimiter.check(ip, 'neynar');
  if (!rateLimitResult.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { address, message, signature } = body;

    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields: address, message, signature' },
        { status: 400 }
      );
    }

    const result = await verifyNeynarSignature(
      address as Address,
      message,
      signature
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Neynar verification error:', error);
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 500 });
  }
}