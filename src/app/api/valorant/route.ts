import { NextRequest, NextResponse } from 'next/server';
import { getAgents, getAgentByUuid, getMaps, getWeapons } from '@/app/services/valorant-api';

// Debug mode - set to true to see more detailed error information
const DEBUG_MODE = true;

// Using henrikdev API - a third-party API for Valorant statistics
// Documentation: https://docs.henrikdev.xyz/valorant.html
const HENRIK_API_BASE_URL = 'https://api.henrikdev.xyz/valorant';

// Using Valorant-API.com - a comprehensive API for game data
// Documentation: https://valorant-api.com/
const VALORANT_API_BASE_URL = 'https://valorant-api.com/v1';

/**
 * GET handler for Valorant data from third-party APIs
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const region = searchParams.get('region') || 'eu';
    const language = searchParams.get('language') || 'en-US';
    
    if (!action) {
      return NextResponse.json({ error: 'Missing action parameter' }, { status: 400 });
    }
    
    switch (action) {
      // Henrik API endpoints for player data
      case 'player':
        const gameName = searchParams.get('gameName');
        const tagLine = searchParams.get('tagLine');
        
        if (!gameName || !tagLine) {
          return NextResponse.json({ error: 'Missing gameName or tagLine parameters' }, { status: 400 });
        }
        
        // Fetch account data
        const accountData = await getPlayerAccount(gameName, tagLine);
        
        // Fetch MMR data
        const mmrData = await getPlayerMMR(gameName, tagLine, region);
        
        // Fetch match history
        const matchHistory = await getMatchHistory(gameName, tagLine, region);
        
        // Combine data and return
        return NextResponse.json({
          account: accountData,
          mmr: mmrData,
          matches: matchHistory
        });
      
      // Valorant-API.com endpoints for game data
      case 'agents':
        // Fetch all agents
        const agents = await getAgents(language);
        return NextResponse.json({ data: agents });
        
      case 'agent':
        const agentUuid = searchParams.get('uuid');
        if (!agentUuid) {
          return NextResponse.json({ error: 'Missing uuid parameter' }, { status: 400 });
        }
        
        // Fetch specific agent
        const agent = await getAgentByUuid(agentUuid, language);
        return NextResponse.json({ data: agent });
        
      case 'maps':
        // Fetch all maps
        const maps = await getMaps(language);
        return NextResponse.json({ data: maps });
        
      case 'weapons':
        // Fetch all weapons
        const weapons = await getWeapons(language);
        return NextResponse.json({ data: weapons });
        
      default:
        return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in Valorant API route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: DEBUG_MODE ? String(error) : undefined
    }, { status: 500 });
  }
}

/**
 * Get player account data from henrik API
 */
async function getPlayerAccount(gameName: string, tagLine: string) {
  try {
    const url = `${HENRIK_API_BASE_URL}/v1/account/${gameName}/${tagLine}`;
    console.log(`Fetching account data from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text available');
      console.error(`Account API error (${response.status}):`, errorText);
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || {};
  } catch (error) {
    console.error('Error fetching account data:', error);
    throw error;
  }
}

/**
 * Get player MMR/rank data from henrik API
 */
async function getPlayerMMR(gameName: string, tagLine: string, region: string) {
  try {
    const url = `${HENRIK_API_BASE_URL}/v1/mmr/${region}/${gameName}/${tagLine}`;
    console.log(`Fetching MMR data from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text available');
      console.error(`MMR API error (${response.status}):`, errorText);
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || {};
  } catch (error) {
    console.error('Error fetching MMR data:', error);
    throw error;
  }
}

/**
 * Get player match history from henrik API
 */
async function getMatchHistory(gameName: string, tagLine: string, region: string) {
  try {
    const url = `${HENRIK_API_BASE_URL}/v3/matches/${region}/${gameName}/${tagLine}?filter=competitive&size=10`;
    console.log(`Fetching match history from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text available');
      console.error(`Match history API error (${response.status}):`, errorText);
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching match history:', error);
    throw error;
  }
}

/**
 * Direct passthrough fetch from Valorant-API.com if needed
 * This can be used for endpoints not explicitly added to the services
 */
async function fetchFromValorantAPI(endpoint: string, language: string = 'en-US') {
  try {
    const url = `${VALORANT_API_BASE_URL}/${endpoint}?language=${language}`;
    console.log(`Fetching from Valorant-API.com: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text available');
      console.error(`Valorant-API error (${response.status}):`, errorText);
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error(`Error fetching from Valorant-API.com:`, error);
    throw error;
  }
}
