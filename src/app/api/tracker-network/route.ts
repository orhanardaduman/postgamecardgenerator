// Tracker Network API route handler
// This is a custom API endpoint that proxies requests to the Tracker Network API for Valorant player data

import { NextRequest, NextResponse } from 'next/server';

// Define interfaces for the response data
interface PlayerStats {
  kda: string;
  winRate: string;
  mvps: string;
  final: string;
}

interface PlayerRank {
  tier: string;
  number: string;
}

interface PlayerData {
  name: string;
  tag: string;
  region: string;
  stats: PlayerStats;
  rank: PlayerRank;
}

/**
 * Simulates a search for players by name
 * In a real implementation, this would call the actual Tracker Network API
 */
async function searchPlayersByName(query: string, region: string): Promise<Array<{name: string, tag: string}>> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For demo purposes, return some mock results based on the query
  // In a real implementation, this would call the actual Tracker Network API
  const mockResults = [
    { name: query, tag: '123' },
    { name: query + 'Pro', tag: '456' },
    { name: 'Best' + query, tag: '789' },
  ];
  
  return mockResults;
}

/**
 * Simulates fetching player data
 * In a real implementation, this would call the actual Tracker Network API
 */
async function fetchPlayerData(name: string, tag: string, region: string): Promise<PlayerData> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate random stats for demo purposes
  // In a real implementation, this would fetch actual data from the Tracker Network API
  const kda = (Math.random() * 3 + 0.5).toFixed(1);
  const winRate = Math.floor(Math.random() * 70 + 30) + '%';
  const mvps = Math.floor(Math.random() * 20).toString();
  const final = Math.floor(Math.random() * 100).toString();
  
  // Generate random rank
  const tiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'ASCENDANT', 'IMMORTAL', 'RADIANT'];
  const tierIndex = Math.floor(Math.random() * (tiers.length - 1));
  const tier = tiers[tierIndex];
  const number = tier === 'RADIANT' ? '' : Math.floor(Math.random() * 3 + 1).toString();
  
  return {
    name,
    tag,
    region,
    stats: {
      kda,
      winRate,
      mvps,
      final
    },
    rank: {
      tier,
      number
    }
  };
}

/**
 * API route handler for Tracker Network API requests
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || '';
  
  // If no specific action is provided, determine it from the URL path
  const path = request.nextUrl.pathname;
  // Check if the path ends with 'search' or 'player'
  const pathParts = path.split('/');
  const lastPathPart = pathParts[pathParts.length - 1];
  const pathAction = lastPathPart === 'search' ? 'search' : lastPathPart === 'player' ? 'player' : '';
  
  console.log('Path:', path, 'Last part:', lastPathPart, 'Action:', pathAction || action);
  
  const finalAction = action || pathAction;
  
  // Get common parameters
  const region = searchParams.get('region') || 'eu';
  
  try {
    // Handle different actions
    if (finalAction === 'search') {
      const query = searchParams.get('query');
      
      if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
      }
      
      const players = await searchPlayersByName(query, region);
      return NextResponse.json({ players });
    } 
    else if (finalAction === 'player') {
      const name = searchParams.get('name');
      const tag = searchParams.get('tag');
      
      if (!name || !tag) {
        return NextResponse.json({ error: 'Name and tag parameters are required' }, { status: 400 });
      }
      
      const playerData = await fetchPlayerData(name, tag, region);
      return NextResponse.json(playerData);
    } 
    else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Tracker Network API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
