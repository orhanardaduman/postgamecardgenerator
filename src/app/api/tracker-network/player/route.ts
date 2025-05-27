// Tracker Network API player endpoint
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

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
  image: string;
}
const apiKey = "HDEV-9219d16f-cfd3-4ee8-9f13-0fce1636546a";
/**
 * Fetches player data using Henrik API for Valorant
 * Based on https://app.swaggerhub.com/apis-docs/Henrik-3/HenrikDev-API/4.2.0
 */
async function fetchPlayerData(name: string, tag: string, region: string): Promise<PlayerData> {
  try {
    // Step 1: Get the player's account information using Henrik API
    const accountResponse = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      {
        headers: {
          'Authorization': apiKey,
        },
      }
    );
    console.log('Account response:', accountResponse);
    if (!accountResponse.ok) {
      throw new Error(`Henrik API account request failed with status: ${accountResponse.status}`);
    }
    
    const accountData = await accountResponse.json();
    console.log('Account data:', accountData);
    
    if (!accountData.data) {
      throw new Error('Invalid account data received from Henrik API');
    }
    
    // Step 2: Get the player's MMR (rank) information
    const mmrResponse = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      {
        headers: {
          'Authorization': apiKey,
        },
      }
    );
    
    let tier = 'GOLD';
    let rank = '2';
    
    if (mmrResponse.ok) {
      const mmrData = await mmrResponse.json();
      console.log('MMR data:', mmrData);
      
      if (mmrData.data && mmrData.data.currenttierpatched) {
        // Parse rank information from the response
        const rankInfo = parseRankFromHenrikApi(mmrData.data.currenttierpatched);
        tier = rankInfo.tier;
        rank = rankInfo.rank;
      }
    }
    
    // Step 3: Get the player's recent matches
    const matchesResponse = await fetch(
      `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?filter=competitive`,
      {
        headers: {
          'Authorization': apiKey,
        },
      }
    );
    
    let kda = '0.0';
    let winRate = '0%';
    let mvps = '0';
    let final = '0';
    
    if (matchesResponse.ok) {
      const matchesData = await matchesResponse.json();
      console.log('Matches data received');
      
      if (matchesData.data && matchesData.data.length > 0) {
        // Process the match data to calculate stats
        const matches = matchesData.data;
        
        // Calculate KDA from the most recent match
        kda = calculateKDA(matches, name, tag);
        
        // Calculate win rate from recent matches
        winRate = calculateWinRate(matches, name, tag);
        
        // Calculate MVP count from recent matches
        mvps = calculateMVPs(matches, name, tag);
        
        // Calculate final score
        final = calculateFinalScore(matches, name, tag);
      }
    }
    
    console.log('Retrieved player data from Riot API for:', name, tag);
    console.log('Stats:', { kda, winRate, mvps, final });
    console.log('Rank:', { tier, rank });
    
    // Return the simulated player data
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
        number: rank
      },
      image: accountData.data.card?.large,
    };
  }
    
  catch (error) {
    console.error('Error generating player data:', error);
    
    // Return fallback data if there's an error
    return {
      name,
      tag,
      region,
      stats: {
        kda: '0.0',
        winRate: '0%',
        mvps: '0',
        final: '0'
      },
      rank: {
        tier: 'GOLD',
        number: '2'
      },
      image: 'https://via.placeholder.com/300'
    };
  }
}

/**
 * Helper function to parse rank information from Henrik API response
 */
function parseRankFromHenrikApi(tierPatched: string): { tier: string, rank: string } {
  // Default values
  let tier = 'UNRANKED';
  let rank = '';
  
  if (!tierPatched || tierPatched === 'Unranked') {
    return { tier, rank };
  }
  
  // Extract tier and rank from the string (e.g., "Gold 2" -> tier: "GOLD", rank: "2")
  const parts = tierPatched.split(' ');
  
  if (parts.length > 0) {
    tier = parts[0].toUpperCase();
    
    // For ranks that have a number (1-3)
    if (parts.length > 1 && /^[1-3]$/.test(parts[1])) {
      rank = parts[1];
    }
  }
  
  return { tier, rank };
}

/**
 * Calculate KDA from match history
 */
function calculateKDA(matches: any[], playerName: string, playerTag: string): string {
  if (!matches || matches.length === 0) {
    return '0.0';
  }
  
  let kills = 0;
  let deaths = 0;
  let assists = 0;
  let matchCount = 0;
  
  // Process up to 5 recent matches
  const matchesToProcess = matches.slice(0, 5);
  
  matchesToProcess.forEach(match => {
    try {
      if (match.players && match.players.all_players) {
        // Find the player in the match
        const playerData = match.players.all_players.find((p: any) => 
          p.name.toLowerCase() === playerName.toLowerCase() && p.tag.toLowerCase() === playerTag.toLowerCase()
        );
        
        if (playerData && playerData.stats) {
          kills += playerData.stats.kills || 0;
          deaths += playerData.stats.deaths || 0;
          assists += playerData.stats.assists || 0;
          matchCount++;
        }
      }
    } catch (e) {
      console.error('Error processing match for KDA:', e);
    }
  });
  
  if (matchCount === 0 || deaths === 0) {
    return '0.0';
  }
  
  // Calculate KDA: (Kills + Assists) / Deaths
  const kda = (kills + assists) / deaths;
  return kda.toFixed(1);
}

/**
 * Calculate win rate from match history
 */
function calculateWinRate(matches: any[], playerName: string, playerTag: string): string {
  if (!matches || matches.length === 0) {
    return '0%';
  }
  
  let wins = 0;
  let totalMatches = 0;
  
  // Process up to 10 recent matches
  const matchesToProcess = matches.slice(0, 10);
  totalMatches = matchesToProcess.length;
  
  matchesToProcess.forEach(match => {
    try {
      if (match.teams && match.players && match.players.all_players) {
        // Find the player in the match
        const playerData = match.players.all_players.find((p: any) => 
          p.name.toLowerCase() === playerName.toLowerCase() && p.tag.toLowerCase() === playerTag.toLowerCase()
        );
        
        if (playerData) {
          const playerTeam = playerData.team.toLowerCase();
          const winningTeam = match.teams.red.has_won ? 'red' : 'blue';
          
          if (playerTeam === winningTeam) {
            wins++;
          }
        }
      }
    } catch (e) {
      console.error('Error processing match for win rate:', e);
    }
  });
  
  if (totalMatches === 0) {
    return '0%';
  }
  
  // Calculate win rate percentage
  const winRate = (wins / totalMatches) * 100;
  return Math.round(winRate) + '%';
}

/**
 * Calculate MVP count from match history
 */
function calculateMVPs(matches: any[], playerName: string, playerTag: string): string {
  if (!matches || matches.length === 0) {
    return '0';
  }
  
  let mvpCount = 0;
  
  // Process up to 10 recent matches
  const matchesToProcess = matches.slice(0, 10);
  
  matchesToProcess.forEach(match => {
    try {
      if (match.players && match.players.all_players) {
        // Find the player in the match
        const playerData = match.players.all_players.find((p: any) => 
          p.name.toLowerCase() === playerName.toLowerCase() && p.tag.toLowerCase() === playerTag.toLowerCase()
        );
        
        if (playerData) {
          // Get all players on the same team
          const teamPlayers = match.players.all_players.filter((p: any) => 
            p.team === playerData.team
          );
          
          // Check if this player has the highest score on their team
          if (teamPlayers.length > 0) {
            const highestScore = Math.max(...teamPlayers.map((p: any) => p.stats.score));
            if (playerData.stats.score === highestScore) {
              mvpCount++;
            }
          }
        }
      }
    } catch (e) {
      console.error('Error processing match for MVPs:', e);
    }
  });
  
  return mvpCount.toString();
}

/**
 * Calculate a final score based on various performance metrics
 */
function calculateFinalScore(matches: any[], playerName: string, playerTag: string): string {
  if (!matches || matches.length === 0) {
    return '0';
  }
  
  let totalKills = 0;
  let totalAssists = 0;
  let totalFirstBloods = 0;
  let totalPlants = 0;
  let totalDefuses = 0;
  let matchCount = 0;
  
  // Process up to 10 recent matches
  const matchesToProcess = matches.slice(0, 10);
  
  matchesToProcess.forEach(match => {
    try {
      if (match.players && match.players.all_players) {
        // Find the player in the match
        const playerData = match.players.all_players.find((p: any) => 
          p.name.toLowerCase() === playerName.toLowerCase() && p.tag.toLowerCase() === playerTag.toLowerCase()
        );
        
        if (playerData && playerData.stats) {
          totalKills += playerData.stats.kills || 0;
          totalAssists += playerData.stats.assists || 0;
          totalFirstBloods += playerData.stats.first_bloods || 0;
          totalPlants += playerData.stats.plants || 0;
          totalDefuses += playerData.stats.defuses || 0;
          matchCount++;
        }
      }
    } catch (e) {
      console.error('Error processing match for final score:', e);
    }
  });
  
  if (matchCount === 0) {
    return '0';
  }
  
  // Calculate a weighted score based on various metrics
  const finalScore = (totalKills * 1) + (totalAssists * 0.5) + (totalFirstBloods * 2) + (totalPlants * 1.5) + (totalDefuses * 1.5);
  return Math.round(finalScore).toString();
}



/**
 * API route handler for player data
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const tag = searchParams.get('tag');
  const region = searchParams.get('region') || 'eu';
  
  console.log('Player data request received:', { name, tag, region });
  
  if (!name || !tag) {
    return NextResponse.json({ error: 'Name and tag parameters are required' }, { status: 400 });
  }
  
  try {
    const playerData = await fetchPlayerData(name, tag, region);
    return NextResponse.json(playerData);
  } catch (error) {
    console.error('Tracker Network API player data error:', error);
    return NextResponse.json({ error: 'Failed to fetch player data' }, { status: 500 });
  }
}
