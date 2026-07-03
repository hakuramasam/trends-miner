'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { Address, verifyMessage } from 'viem';
import { getFarcasterUserByAddress } from '@/lib/neynar';
import { signIn, signOut, useSession } from 'next-auth/react';

export interface WalletButtonProps {
  className?: string;
  showFarcaster?: boolean;
}

export function WalletButton({ className = '', showFarcaster = true }: WalletButtonProps) {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { data: session, status: sessionStatus } = useSession();

  const [farcasterUser, setFarcasterUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address && showFarcaster) {
      loadFarcasterUser();
    } else {
      setFarcasterUser(null);
    }
  }, [address, isConnected, showFarcaster]);

  const loadFarcasterUser = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);
    setError(null);
    try {
      const user = await getFarcasterUserByAddress(address);
      setFarcasterUser(user);
    } catch {
      setFarcasterUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const handleFarcasterLogin = useCallback(async () => {
    if (!address || !connector) return;
    setIsSigning(true);
    setError(null);

    try {
      const message = 'Sign in with Farcaster to Trends Miner.\n\nWallet: ' + address + '\nNonce: ' + Date.now();
      const signature = await signMessageAsync({ message });

      const isValid = await verifyMessage({
        address,
        message,
        signature,
      });

      if (!isValid) {
        throw new Error('Invalid signature');
      }

      const result = await signIn('farcaster', {
        address,
        message,
        signature,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      await loadFarcasterUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSigning(false);
    }
  }, [address, connector, signMessageAsync, loadFarcasterUser]);

  const handleConnect = useCallback(async () => {
    if (connectors.length === 0) {
      setError('No wallet connectors available');
      return;
    }
    await connect({ connector: connectors[0] });
  }, [connect, connectors]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      if (session) {
        await signOut({ redirect: false });
      }
      setFarcasterUser(null);
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  }, [disconnect, session]);

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

  if (isConnected) {
    return (
      <div className={'flex items-center gap-3 ' + className}>
        {isSigning ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : farcasterUser ? (
          <div className="flex items-center gap-2">
            {farcasterUser.pfpUrl && (
              <img
                src={farcasterUser.pfpUrl}
                alt={farcasterUser.displayName}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {farcasterUser.displayName || farcasterUser.username || 'Farcaster User'}
              </span>
              <span className="text-xs text-gray-400">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="font-medium text-sm">Connected</span>
            <span className="text-xs text-gray-400">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {showFarcaster && !farcasterUser && (
            <button
              onClick={handleFarcasterLogin}
              disabled={isSigning}
              className="px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigning ? 'Signing...' : 'Link Farcaster'}
            </button>
          )}
          <button
            onClick={handleDisconnect}
            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className={'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ' + className}
    >
      Connect Wallet
    </button>
  );
}

export default WalletButton;