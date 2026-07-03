import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { Address } from 'viem';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;

let neynarClient: NeynarAPIClient | null = null;

function getNeynarClient(): NeynarAPIClient {
  if (!neynarClient) {
    neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);
  }
  return neynarClient;
}

export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  address: Address;
  bio: string;
  followerCount: number;
  followingCount: number;
}

export interface NeynarSignatureVerification {
  isValid: boolean;
  address?: Address;
  fid?: number;
}

export async function getFarcasterUserByAddress(address: Address): Promise<FarcasterUser | null> {
  try {
    const client = getNeynarClient();
    const users = await client.fetchBulkUsersByEthereumAddress([address]);
    if (!users?.users?.length) {
      return null;
    }
    const user = users.users[0];
    return {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url || '',
      address: address,
      bio: user.profile.bio.text || '',
      followerCount: user.follower_count || 0,
      followingCount: user.following_count || 0,
    };
  } catch (error) {
    console.error('Failed to fetch Farcaster user:', error);
    return null;
  }
}

export async function getFarcasterUserByFid(fid: number): Promise<FarcasterUser | null> {
  try {
    const client = getNeynarClient();
    const user = await client.fetchUser(fid);
    if (!user) {
      return null;
    }
    return {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url || '',
      address: user.verified_addresses.eth_addresses[0] as Address,
      bio: user.profile.bio.text || '',
      followerCount: user.follower_count || 0,
      followingCount: user.following_count || 0,
    };
  } catch (error) {
    console.error('Failed to fetch Farcaster user by FID:', error);
    return null;
  }
}

export async function verifyNeynarSignature(
  address: Address,
  message: string,
  signature: string
): Promise<NeynarSignatureVerification> {
  try {
    const client = getNeynarClient();
    const result = await client.verifySignature({
      address,
      message,
      signature,
    });
    return {
      isValid: result.isValid,
      address: result.address as Address | undefined,
      fid: result.fid,
    };
  } catch (error) {
    console.error('Failed to verify Neynar signature:', error);
    return { isValid: false };
  }
}

export async function getTrendingCasts(limit: number = 10): Promise<any[]> {
  try {
    const client = getNeynarClient();
    const casts = await client.fetchTrendingCasts(limit);
    return casts.casts || [];
  } catch (error) {
    console.error('Failed to fetch trending casts:', error);
    return [];
  }
}

export async function getUserCasts(fid: number, limit: number = 10): Promise<any[]> {
  try {
    const client = getNeynarClient();
    const casts = await client.fetchUserCasts(fid, limit);
    return casts.casts || [];
  } catch (error) {
    console.error('Failed to fetch user casts:', error);
    return [];
  }
}