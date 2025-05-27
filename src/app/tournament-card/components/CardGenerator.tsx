'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CardGeneratorProps } from '../types';
import { getRankIconUrl } from '@/app/services/valorant-api';

export default function CardGenerator({ cardData, onDataChange }: CardGeneratorProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [logoPreviewUrls, setLogoPreviewUrls] = useState<{[key: number]: string}>({});
  const [valorantPlayer, setValorantPlayer] = useState({ name: '', tag: '' });
  const [valorantRegion, setValorantRegion] = useState('eu');
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [playerRank, setPlayerRank] = useState({ tier: 'GOLD', rank: '2' });
  const [rankIconUrl, setRankIconUrl] = useState<string>('');
  const [playerImageUrl, setPlayerImageUrl] = useState<string | null>(null);  
  
  // Update rank icon URL when player rank changes
  useEffect(() => {
    setRankIconUrl(getRankIconUrl(playerRank.tier, playerRank.rank));
  }, [playerRank]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onDataChange({ avatar: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Stats management
  const handleAddStat = () => {
    onDataChange({
      stats: [
        ...cardData.stats,
        { label: 'STAT', value: '0' }
      ]
    });
  };

  const handleUpdateStat = (index: number, field: string, value: string) => {
    const updatedStats = [...cardData.stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    onDataChange({ stats: updatedStats });
  };

  const handleRemoveStat = (index: number) => {
    const updatedStats = cardData.stats.filter((_, i) => i !== index);
    onDataChange({ stats: updatedStats });
  };

  const handleAddBrandLogo = () => {
    onDataChange({
      brandLogos: [
        ...cardData.brandLogos, 
        { name: '', imageUrl: '' }
      ]
    });
  };

  const handleUpdateBrandLogo = (index: number, field: string, value: string) => {
    const updatedLogos = [...cardData.brandLogos];
    updatedLogos[index] = { 
      ...updatedLogos[index], 
      [field]: value 
    };
    onDataChange({ brandLogos: updatedLogos });
  };

  const handleRemoveBrandLogo = (index: number) => {
    const updatedLogos = cardData.brandLogos.filter((_, i) => i !== index);
    onDataChange({ brandLogos: updatedLogos });
    
    // Remove logo preview if exists
    if (logoPreviewUrls[index]) {
      const updatedPreviews = {...logoPreviewUrls};
      delete updatedPreviews[index];
      setLogoPreviewUrls(updatedPreviews);
    }
  };

  // Parse player name and tag from input (format: "Name#Tag")
  const handlePlayerNameChange = (input: string) => {
    // Split the input by # character
    const parts = input.split('#');
    
    if (parts.length > 1) {
      // If there's a # in the input, use parts before # as name and after # as tag
      const name = parts[0].trim();
      const tag = parts.slice(1).join('#').trim(); // Join all parts after the first # in case there are multiple #
      setValorantPlayer({ name, tag });
    } else {
      // If there's no #, just update the name
      setValorantPlayer({ name: input.trim(), tag: valorantPlayer.tag });
    }
  };

  // Fetch player stats from Tracker Network API (third-party)
  const fetchStats = async () => {
    if (!valorantPlayer.name || !valorantPlayer.tag) {
      alert('Please enter a player name and tag');
      return;
    }

    setIsLoadingStats(true);
    
    try {
      // Make a request to our custom API endpoint that will proxy the request to Tracker Network
      const response = await fetch(
        `/api/tracker-network/player?name=${encodeURIComponent(valorantPlayer.name)}&tag=${encodeURIComponent(valorantPlayer.tag)}&region=${valorantRegion}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);      
      // Extract stats from the response
      const stats = {
        kda: data.stats?.kda || '0.0',
        winRate: data.stats?.winRate || '0%',
        mvps: data.stats?.mvps || '0',
        final: data.stats?.final || '0',
        tier: data.rank?.tier || 'GOLD',
        rank: data.rank?.number || '2',
        image: data.image || 'https://via.placeholder.com/300'
      };

      // Update card data with the fetched stats
      const updatedStats = [
        { label: 'KDA', value: stats.kda },
        { label: 'WIN RATE', value: stats.winRate },
        { label: 'MVPS', value: stats.mvps },
        { label: 'FINAL', value: stats.final }
      ];

      // Update player rank information
      setPlayerRank({
        tier: stats.tier,
        rank: stats.rank
      });

      // Update player image if available
      if (stats.image) {
        setPlayerImageUrl(stats.image);
        // Also update avatar in card data
        onDataChange({ 
          stats: updatedStats,
          playerName: valorantPlayer.name.toUpperCase(),
          role: `${stats.tier} ${stats.rank}`.trim(), // Set role to player's rank
          playerImage: stats.image // Add player image from API
        });
      } else {
        onDataChange({ 
          stats: updatedStats,
          playerName: valorantPlayer.name.toUpperCase(),
          role: `${stats.tier} ${stats.rank}`.trim() // Set role to player's rank
        });
      }

      // Show success message
      alert('Player stats loaded successfully!');
    } catch (error) {
      console.error('Error fetching player stats:', error);
      alert('Failed to fetch player stats. Please try again.');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleLogoImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      
      // Update the brand logo with the image URL
      const updatedLogos = [...cardData.brandLogos];
      updatedLogos[index] = { 
        ...updatedLogos[index], 
        imageUrl: imageUrl
      };
      onDataChange({ brandLogos: updatedLogos });
      
      // Store the preview URL
      setLogoPreviewUrls(prev => ({
        ...prev,
        [index]: imageUrl
      }));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-white">
      <h2 className="text-xl font-semibold text-blue-400">Player Information</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-400">Player Name</label>
          <input
            type="text"
            value={cardData.playerName}
            onChange={(e) => onDataChange({ playerName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter player name"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-400">Title</label>
          <input
            type="text"
            value={cardData.title}
            onChange={(e) => onDataChange({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. LALE ERGIN"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-400">Role</label>
          <input
            type="text"
            value={cardData.role}
            onChange={(e) => onDataChange({ role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. CO-FOUNDER & CEO"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-400">Team Name</label>
          <input
            type="text"
            value={cardData.teamName}
            onChange={(e) => onDataChange({ teamName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter team name"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-400">Avatar</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none"
              accept="image/*"
            />
            {playerImageUrl && (
              <button 
                type="button"
                onClick={() => {
                  // Use player image from API as avatar
                  if (playerImageUrl) {
                    // First, update the card data with the player image
                    onDataChange({ 
                      playerImage: playerImageUrl,
                      avatar: null // Clear any uploaded avatar file
                    });
                    
                    // Then set the avatar preview to show the image
                    setAvatarPreview(playerImageUrl);
                    
                    // Show confirmation to user
                    alert('Player image set as avatar!');
                    
                    console.log('Updated player image:', playerImageUrl);
                  } else {
                    alert('No player image available. Please fetch player stats first.');
                  }
                }}
                className="py-2 px-4 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 focus:outline-none"
              >
                Use Player Image
              </button>
            )}
          </div>
          {(avatarPreview || playerImageUrl) && (
            <div className="mt-2 flex space-x-4">
              {avatarPreview && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Current Avatar:</p>
                  <Image 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    width={100} 
                    height={100} 
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              {playerImageUrl && !avatarPreview && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Player Image from API:</p>
                  <Image 
                    src={playerImageUrl} 
                    alt="Player image from API" 
                    width={100} 
                    height={100} 
                    className="rounded-md object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <hr className="my-6" />
      
      <h2 className="text-xl font-semibold text-blue-400">Valorant API Integration</h2>
      
      <div className="bg-gray-800 p-4 rounded-md mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-400">Valorant Player (Name#Tag)</label>
            <input
              type="text"
              value={`${valorantPlayer.name}${valorantPlayer.tag ? '#' + valorantPlayer.tag : ''}`}
              onChange={(e) => handlePlayerNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter player name#tag (e.g. ENVY Thanos#LVgod)"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-400">Region</label>
            <select
              value={valorantRegion}
              onChange={(e) => setValorantRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="eu">Europe (EU)</option>
              <option value="na">North America (NA)</option>
              <option value="ap">Asia Pacific (AP)</option>
              <option value="kr">Korea (KR)</option>
            </select>
          </div>
        </div>
        
        {/* Display player rank if available */}
        {rankIconUrl && (
          <div className="mt-3 flex items-center">
            <div className="mr-3">
              <label className="block text-sm font-medium text-blue-400 mb-1">Current Rank</label>
              <div className="flex items-center bg-gray-700 rounded-md p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={rankIconUrl} 
                  alt={`${playerRank.tier} ${playerRank.rank}`}
                  className="h-10 w-10 mr-2"
                />
                <span className="text-white">
                  {playerRank.tier} {playerRank.rank}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={fetchStats}
          disabled={isLoadingStats}
          className={`mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition ${isLoadingStats ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoadingStats ? 'Loading...' : 'Fetch Player Stats'}
        </button>
        
        <p className="mt-2 text-xs text-gray-400">
          Using Henrik API integration. Player stats will be fetched and displayed on the card.
        </p>
      </div>
      
      {/*<h2 className="text-xl font-semibold text-blue-400 mt-4">Stats</h2>
      <div className="space-y-3 mt-2 sm:mt-3">
        {cardData.stats.map((stat, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex-1 w-full">
              <input
                type="text"
                value={stat.label}
                onChange={(e) => handleUpdateStat(index, 'label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Stat Name"
              />
            </div>
            
            <div className="flex-1 w-full">
              <input
                type="text"
                value={stat.value}
                onChange={(e) => handleUpdateStat(index, 'value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Stat Value"
              />
            </div>
            
            <button
              onClick={() => handleRemoveStat(index)}
              className="p-2 text-red-400 hover:text-red-300 self-center"
              disabled={cardData.stats.length <= 1}
              title={cardData.stats.length <= 1 ? "At least one stat is required" : "Remove stat"}
            >
              {cardData.stats.length > 1 ? "Remove" : ""}
            </button>
          </div>
        ))}
        
        <button
          onClick={handleAddStat}
          className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm sm:text-base"
          disabled={cardData.stats.length >= 4}
          title={cardData.stats.length >= 4 ? "Maximum 4 stats allowed" : "Add stat"}
        >
          Add Stat {cardData.stats.length}/4
        </button>
        
        <p className="text-xs text-gray-400 mt-1">
          You can add up to 4 stats. At least 1 stat is required.
        </p>
      </div>*/}

      <hr className="my-6" />
      
      <h2 className="text-xl font-semibold text-blue-400">Card Template</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
        {(['classic', 'modern', 'minimalist', 'new_one', 'golden', 'flaptzy'] as const).map((template) => (
          <div 
            key={template}
            onClick={() => onDataChange({ template })}
            className={`
              h-12 rounded-md cursor-pointer flex items-center justify-center font-medium
              ${cardData.template === template ? 'ring-2 ring-offset-2 ring-blue-500' : 'border border-gray-300'}
              ${template === 'classic' ? 'bg-blue-900 text-white' : ''}
              ${template === 'modern' ? 'bg-purple-900 text-white' : ''}
              ${template === 'minimalist' ? 'bg-gray-900 text-white' : ''}
              ${template === 'new_one' ? 'bg-gray-900 text-white' : ''}
              ${template === 'golden' ? 'bg-yellow-800 text-white' : ''}
              ${template === 'flaptzy' ? 'bg-red-900 text-white' : ''}
            `}
          >
            {template.replace('_', ' ').toUpperCase()}
          </div>
        ))}
      </div>

      <hr className="my-6" />
    </div>
  );
}
