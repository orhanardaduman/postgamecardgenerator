'use client';

import { useEffect, useState } from 'react';
import CardTemplate from '../../components/CardTemplate';
import { ModernTemplate, EsportsTemplate, MinimalistTemplate } from '../../components/CardTemplateVariations';
import { CardData } from '../../types';
import { useParams } from 'next/navigation';

// In a real app, this would fetch the card data from an API
// For this demo, we'll use mock data
const getMockCardData = (id: string): CardData => {
  // You could have different mock data based on the ID
  return {
    playerName: 'LALE ERGIN',
    title: 'CO-FOUNDER & CEO',
    teamName: 'ESA ESPORTS',
    avatar: null,
    stats: {
      kda: '5.8',
      mvps: '4',
      winRate: '90%',
      finalPlacement: '3RD'
    },
    theme: 'blue',
    template: 'classic',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com/username' },
      { platform: 'instagram', url: 'https://instagram.com/username' }
    ],
    brandLogos: [
      { name: 'READY2.GG', imageUrl: '' },
      { name: 'BtcTurk', imageUrl: '' }
    ]
  };
};

export default function SharePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      setCardData(getMockCardData(id));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${cardData?.playerName}'s Tournament Card`,
        text: `Check out ${cardData?.playerName}'s tournament performance!`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tournament card...</p>
        </div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Card Not Found</h1>
          <p className="text-gray-600 mb-4">The tournament card you're looking for doesn't exist or has been removed.</p>
          <a href="/tournament-card" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Create Your Own Card
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-center mb-6">{cardData.playerName}'s Tournament Card</h1>
            
            <div className="flex justify-center">
              {cardData.template === 'modern' && (
                <ModernTemplate cardData={cardData} className="w-full max-w-sm" />
              )}
              {cardData.template === 'esports' && (
                <EsportsTemplate cardData={cardData} className="w-full max-w-sm" />
              )}
              {cardData.template === 'minimalist' && (
                <MinimalistTemplate cardData={cardData} className="w-full max-w-sm" />
              )}
              {(cardData.template === 'classic' || !cardData.template) && (
                <CardTemplate cardData={cardData} className="w-full max-w-sm" />
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Share This Card</h2>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleShare}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share Card
              </button>
              
              <a 
                href="/tournament-card"
                className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-center"
              >
                Create Your Own Card
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
