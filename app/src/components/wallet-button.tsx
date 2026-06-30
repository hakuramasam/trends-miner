"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  useSwitchChain,
} from "wagmi";
import { SiweMessage } from "siwe";
import { BASE_CHAIN_ID } from "@/lib/constants";
import { shortenAddress } from "@/lib/format";

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    const res = await fetch("/api/session");
    const data = await res.json();
    setIsLoggedIn(Boolean(data.isLoggedIn));
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession, address]);

  const signIn = async () => {
    if (!address || !chainId) return;
    setIsSigning(true);
    setError(null);
    try {
      if (chainId !== BASE_CHAIN_ID) {
        await switchChainAsync({ chainId: BASE_CHAIN_ID });
      }

      const nonceRes = await fetch("/api/siwe/nonce");
      const { nonce } = await nonceRes.json();

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to Trends Mining Simulator",
        uri: window.location.origin,
        version: "1",
        chainId: BASE_CHAIN_ID,
        nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const verifyRes = await fetch("/api/siwe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.prepareMessage(),
          signature,
        }),
      });

      if (!verifyRes.ok) throw new Error("SIWE verification failed");
      setIsLoggedIn(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setIsSigning(false);
    }
  };

  const signOut = async () => {
    await fetch("/api/siwe/logout", { method: "POST" });
    disconnect();
    setIsLoggedIn(false);
  };

  if (isConnected && address) {
    return (
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-400">
            {shortenAddress(address)}
          </span>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={signOut}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-red-500/50 hover:text-red-400"
            >
              Sign out
            </button>
          ) : (
            <button
              type="button"
              onClick={signIn}
              disabled={isSigning}
              className="rounded-lg bg-[#0052FF] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0046db] disabled:opacity-50"
            >
              {isSigning ? "Signing…" : "Sign in (SIWE)"}
            </button>
          )}
        </div>
        {isLoggedIn && (
          <span className="text-[10px] uppercase tracking-widest text-emerald-400">
            Session active
          </span>
        )}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          type="button"
          onClick={() => connect({ connector })}
          disabled={isConnecting}
          className="rounded-lg bg-[#0052FF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0046db] disabled:opacity-50"
        >
          {isConnecting ? "Connecting…" : connector.name}
        </button>
      ))}
    </div>
  );
}
