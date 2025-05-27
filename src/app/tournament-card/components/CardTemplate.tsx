'use client';

import { CardTemplateProps } from '../types';

export default function CardTemplate({ cardData, className = '' }: CardTemplateProps) {
  // Use player image from API or avatar if provided, otherwise use placeholder
  const avatarSrc = cardData.playerImage
    ? cardData.playerImage
    : cardData.avatar 
      ? URL.createObjectURL(cardData.avatar) 
      : 'https://via.placeholder.com/300';
      
  // Check if the card has any image (either playerImage from API or uploaded avatar)
  const hasImage = Boolean(cardData.playerImage || cardData.avatar);

  // Default styling with custom border color
  const defaultBorderColor = cardData.borderColor || '#D4AF37';

  return (
    <div 
      className={`relative rounded-lg overflow-hidden border-2 bg-[#0a2240] ${className}`}
      style={{ aspectRatio: '9/16', maxWidth: '100%', borderColor: defaultBorderColor }}
    >
      
      {/* Team Name */}
      <div className="relative pt-6 pb-2 text-center z-1">
        <h1 className="text-2xl font-bold uppercase" style={{ color: defaultBorderColor }}>
          {cardData.teamName || 'TEAM NAME'}
        </h1>
      </div>

      {/* Player Image and Info */}
      <div className="flex flex-col items-center px-6 z-20" >
        <div className="w-40 h-40 rounded-full overflow-hidden border-2 mb-4 shadow-lg" style={{ borderColor: defaultBorderColor }}>
          {hasImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={avatarSrc} 
              alt={cardData.playerName || 'Player'} 
              className="w-full h-full object-cover"
            />
          )}
          {!hasImage && (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        <h2 className="text-5xl font-bold uppercase mt-4 text-white">
          {cardData.playerName || 'PLAYER NAME'}
        </h2>
        
        <p className="text-lg uppercase mt-2 text-white opacity-90">
          {cardData.title || 'CO-FOUNDER & CEO'}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-12 mb-16">
        <div className={`grid ${cardData.stats.length === 1 ? 'grid-cols-1' : cardData.stats.length === 2 ? 'grid-cols-2' : cardData.stats.length === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-0 text-center border-t border-b py-6`} style={{ borderColor: defaultBorderColor }}>
          {cardData.stats.map((stat, index) => (
            <div key={index}>
              <p className="text-sm font-medium" style={{ color: defaultBorderColor }}>{stat.label}</p>
              <p className="text-4xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Logos */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center gap-6 bg-black bg-opacity-40 border-t border-gray-700">
        {cardData.brandLogos.length > 0 ? (
          cardData.brandLogos.map((logo, index) => (
            <div key={index} className="h-10">
              {logo.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={logo.imageUrl} 
                  alt={logo.name} 
                  className="h-full object-contain"
                  style={{ filter: 'drop-shadow(0 0 0 white) invert(1)' }}
                />
              ) : (
                <div className="h-full px-4 bg-white bg-opacity-10 flex items-center rounded-full">
                  <span className="text-white text-sm font-medium">{logo.name}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
              <span className="text-white font-medium">R2</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
              <span className="text-white font-medium">BT</span>
            </div>
          </>
        )}
      </div>

      {/* Social Media Links */}
      {cardData.socialLinks.length > 0 && (
        <div className="absolute top-6 right-6 flex flex-col gap-3">
          {cardData.socialLinks.map((link, index) => (
            <div 
              key={index} 
              className="w-9 h-9 rounded-full bg-white bg-opacity-10 border border-gray-600 flex items-center justify-center hover:bg-opacity-20 transition-all"
              title={link.platform}
            >
              <span className="text-white text-xs font-bold">
                {link.platform.charAt(0).toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
