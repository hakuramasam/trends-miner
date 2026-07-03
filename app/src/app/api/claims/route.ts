import { NextRequest, NextResponse } from 'next/server';
import { Address } from 'viem';
import { fetchEmpireUser } from '@/lib/empire';
import { processClaim, verifyClaimRequest, getTreasuryBalance } from '@/lib/treasury';
import { RateLimiter } from '@/lib/rate-limit';
import { calculateStakeMultiplier } from '@/lib/constants';

const claimRateLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 5 });

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? request.headers.get('x-real-ip') ?? 'unknown';
    const rateLimitResult = await claimRateLimiter.check(ip, 'claim');
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { address, amount, signature, nonce } = body;

    if (!address || !amount || !signature || !nonce) {
      return NextResponse.json(
        { error: 'Missing required fields: address, amount, signature, nonce' },
        { status: 400 }
      );
    }

    const isValid = await verifyClaimRequest({
      address: address as Address,
      amount: BigInt(amount),
      signature: signature as `0x${string}`,
      nonce,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid claim request - signature verification failed' },
        { status: 400 }
      );
    }

    const empireUser = await fetchEmpireUser(address as Address);
    if (!empireUser) {
      return NextResponse.json(
        { error: 'User not found in Empire Builder' },
        { status: 404 }
      );
    }

    const userMultiplier = calculateStakeMultiplier(empireUser.staked);
    const maxClaimable = calculateMaxClaimable(empireUser);
    const claimAmount = BigInt(amount);

    if (claimAmount > maxClaimable) {
      return NextResponse.json(
        { error: 'Claim amount exceeds maximum claimable', maxClaimable: maxClaimable.toString() },
        { status: 400 }
      );
    }

    const treasuryBalance = await getTreasuryBalance();
    if (treasuryBalance < claimAmount) {
      return NextResponse.json(
        { error: 'Insufficient treasury balance' },
        { status: 503 }
      );
    }

    const result = await processClaim(address as Address, claimAmount);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Claim processing failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionHash: result.transactionHash,
      claimedAmount: claimAmount.toString(),
      multiplier: userMultiplier,
    });
  } catch (error) {
    console.error('Claim API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateMaxClaimable(user: any): bigint {
  const multiplier = calculateStakeMultiplier(user.staked);
  const baseReward = 1000n;
  return baseReward * BigInt(Math.floor(multiplier * 100)) / 100n;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter required' },
      { status: 400 }
    );
  }

  try {
    const empireUser = await fetchEmpireUser(address as Address);
    if (!empireUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const treasuryBalance = await getTreasuryBalance();
    const userMultiplier = calculateStakeMultiplier(empireUser.staked);
    const maxClaimable = calculateMaxClaimable(empireUser);

    return NextResponse.json({
      address: empireUser.address,
      balance: empireUser.balance.toString(),
      staked: empireUser.staked.toString(),
      multiplier: userMultiplier,
      lastClaim: empireUser.lastClaim,
      totalClaimed: empireUser.totalClaimed.toString(),
      maxClaimable: maxClaimable.toString(),
      treasuryBalance: treasuryBalance.toString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}