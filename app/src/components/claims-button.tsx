'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
import { fetchEmpireUser } from '@/lib/empire';
import { calculateStakeMultiplier } from '@/lib/constants';
import { formatEther } from 'viem';

export interface ClaimsButtonProps {
  className?: string;
}

export function ClaimsButton({ className = '' }: ClaimsButtonProps) {
  const { address, isConnected } = useAccount();
  const [empireUser, setEmpireUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState<{ txHash: string; amount: string } | null>(null);

  const loadUserData = useCallback(async () => {
    if (!address) {
      setEmpireUser(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const user = await fetchEmpireUser(address as Address);
      setEmpireUser(user);
    } catch {
      setEmpireUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      loadUserData();
    } else {
      setEmpireUser(null);
    }
  }, [address, isConnected, loadUserData]);

  const handleClaim = useCallback(async () => {
    if (!address || !empireUser) return;
    setIsClaiming(true);
    setError(null);

    try {
      const multiplier = calculateStakeMultiplier(empireUser.staked);
      const claimAmount = calculateClaimAmount(empireUser, multiplier);

      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          amount: claimAmount.toString(),
          signature: 'placeholder',
          nonce: Date.now().toString(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Claim failed');
      }

      setClaimResult({
        txHash: data.transactionHash,
        amount: formatEther(claimAmount),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Claim failed');
    } finally {
      setIsClaiming(false);
      setTimeout(loadUserData, 2000);
    }
  }, [address, empireUser, loadUserData]);

  const calculateClaimAmount = (user: any, multiplier: number): bigint => {
    const baseAmount = 1000n;
    const multiplierBigInt = BigInt(Math.floor(multiplier * 100));
    return (baseAmount * multiplierBigInt) / 100n;
  };

  if (isLoading) {
    return (
      <div className={'flex items-center gap-2 ' + className}>
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={'text-red-500 ' + className}>
        {error}
        <button onClick={() => setError(null)} className="ml-2 text-sm underline">
          Dismiss
        </button>
      </div>
    );
  }

  if (claimResult) {
    return (
      <div className={'bg-green-50 p-4 rounded-lg ' + className}>
        <p className="text-green-700 font-medium">Claim successful!</p>
        <p className="text-sm text-green-600">
          Claimed: {claimResult.amount} $TREND
        </p>
        <p className="text-xs text-green-500 font-mono">
          Tx: {claimResult.txHash.slice(0, 6)}...{claimResult.txHash.slice(-4)}
        </p>
        <a
          href={'https://basescan.org/tx/' + claimResult.txHash}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-green-600 text-sm underline"
        >
          View on BaseScan
        </a>
        <button onClick={() => setClaimResult(null)} className="block mt-2 text-sm text-green-600 underline">
          Close
        </button>
      </div>
    );
  }

  if (!isConnected || !address) {
    return (
      <button disabled className={'px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed ' + className}>
        Connect Wallet to Claim
      </button>
    );
  }

  if (!empireUser) {
    return (
      <button disabled className={'px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed ' + className}>
        No Empire Data
      </button>
    );
  }

  const multiplier = calculateStakeMultiplier(empireUser.staked);
  const claimAmount = calculateClaimAmount(empireUser, multiplier);
  const formattedAmount = formatEther(claimAmount);

  return (
    <div className={'space-y-2 ' + className}>
      <div className="text-sm">
        <p>
          <span className="font-medium">Staked:</span> {formatEther(empireUser.staked)} $TREND
        </p>
        <p>
          <span className="font-medium">Multiplier:</span> {multiplier}x
        </p>
        <p>
          <span className="font-medium">Est. Claim:</span> {formattedAmount} $TREND
        </p>
      </div>
      <button
        onClick={handleClaim}
        disabled={isClaiming || empireUser.staked === 0n}
        className={'w-full px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-medium hover:from-gold-600 hover:to-gold-700 disabled:opacity-50 disabled:cursor-not-allowed ' + className}
      >
        {isClaiming ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Claiming...
          </span>
        ) : empireUser.staked === 0n ? (
          'Stake $TREND to Claim'
        ) : (
          'Claim ' + formattedAmount + ' $TREND'
        )}
      </button>
    </div>
  );
}

export default ClaimsButton;