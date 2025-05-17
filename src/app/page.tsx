'use client';

import { useState, useRef } from 'react';
import CardGenerator from '@/app/tournament-card/components/CardGenerator';
import CardPreview from '@/app/tournament-card/components/CardPreview';
import { CardData } from '@/app/tournament-card/types';

export default function TournamentCardPage() {
  const [cardData, setCardData] = useState<CardData>({
    playerName: '',
    title: '',
    teamName: '',
    role: 'CO-FOUNDER & CEO',
    avatar: null,
    stats: [
      { label: 'KDA', value: '5.8' },
      { label: 'MVPs', value: '4' },
      { label: 'WIN RATE', value: '90%' },
      { label: 'FINAL', value: '3RD' }
    ],
    borderColor: '#D4AF37',
    backgroundColor: '#0a2240',
    textColor: '#FFFFFF',
    accentColor: '#F7D366',
    template: 'classic',
    socialLinks: [],
    brandLogos: []
  });

  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
  const previewRef = useRef<{ downloadCardAsImage: () => Promise<void> }>(null);

  const handleDataChange = (newData: Partial<CardData>) => {
    setCardData((prev: CardData) => ({ ...prev, ...newData }));
  };

  const generateCard = () => {
    // Trigger the download functionality in the CardPreview component
    if (previewRef.current) {
      previewRef.current.downloadCardAsImage();
    }
    
    // Also set the generated URL for sharing (optional)
    setGeneratedCardUrl(`/tournament-card/share/${Math.random().toString(36).substring(2, 15)}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-blue-400">Tournament Card Generator</h1>
        
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-8">
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-3 sm:p-6 overflow-x-auto">
            <CardGenerator 
              cardData={cardData} 
              onDataChange={handleDataChange} 
              onGenerate={generateCard}
            />
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-3 sm:p-6 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Card Preview</h2>
            <CardPreview ref={previewRef} cardData={cardData} />
            
            {generatedCardUrl && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 font-medium">Card generated successfully!</p>
                <p className="text-sm text-gray-600 mt-2">
                  Share link: <a href={generatedCardUrl} className="text-blue-600 underline">{window.location.origin}{generatedCardUrl}</a>
                </p>
                <button 
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}${generatedCardUrl}`);
                    alert('Link copied to clipboard!');
                  }}
                >
                  Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
