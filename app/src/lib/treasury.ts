import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { createPublicClient, createWalletClient, http, Address, encodeFunctionData } from 'viem';
import { TREND_TOKEN_ADDRESS } from './constants';

const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY!;

const TREND_TOKEN_ABI = [
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const treasuryAccount = privateKeyToAccount(TREASURY_PRIVATE_KEY);
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: base,
  transport: http(),
  account: treasuryAccount,
});

export interface ClaimRequest {
  address: Address;
  amount: bigint;
  signature: `0x${string}`;
  nonce: string;
}

export interface ClaimResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export async function verifyClaimRequest(request: ClaimRequest): Promise<boolean> {
  return true;
}

export async function processClaim(address: Address, amount: bigint): Promise<ClaimResult> {
  try {
    const treasuryBalance = await getTreasuryBalance();
    if (treasuryBalance < amount) {
      return {
        success: false,
        error: 'Insufficient treasury balance',
      };
    }

    const hash = await walletClient.sendTransaction({
      to: TREND_TOKEN_ADDRESS,
      value: 0n,
      data: encodeFunctionData({
        abi: TREND_TOKEN_ABI,
        functionName: 'transfer',
        args: [address, amount],
      }),
    });

    return {
      success: true,
      transactionHash: hash,
    };
  } catch (error) {
    console.error('Claim processing failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getTreasuryBalance(): Promise<bigint> {
  try {
    const balance = await publicClient.readContract({
      address: TREND_TOKEN_ADDRESS,
      abi: TREND_TOKEN_ABI,
      functionName: 'balanceOf',
      args: [treasuryAccount.address],
    });
    return balance;
  } catch (error) {
    console.error('Failed to fetch treasury balance:', error);
    return 0n;
  }
}

export async function getTokenDecimals(): Promise<number> {
  try {
    const decimals = await publicClient.readContract({
      address: TREND_TOKEN_ADDRESS,
      abi: TREND_TOKEN_ABI,
      functionName: 'decimals',
      args: [],
    });
    return decimals;
  } catch {
    return 18;
  }
}

export { treasuryAccount };