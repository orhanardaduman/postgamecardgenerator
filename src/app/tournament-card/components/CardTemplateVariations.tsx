'use client';

import { CardTemplateProps } from '../types';

// Base template is already created, now let's add variations

// Variation 1: Modern style matching the provided image with navy blue and gold theme
export function ModernTemplate({ cardData, className = '' }: CardTemplateProps) {
  // Default avatar if none provided
  const avatarSrc = cardData.avatar 
    ? URL.createObjectURL(cardData.avatar) 
    : 'https://via.placeholder.com/300';

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: '9/16', 
        maxWidth: '100%',
        backgroundColor: cardData.backgroundColor || '#0a2240' 
      }}
    >
      {/* Main border frame */}
      
      {/* Decorative line that starts from the bottom center and goes around with angled turns */}
      <svg className="absolute inset-0 w-full h-full z-15 pointer-events-none overflow-visible" viewBox="0 0 360 640" preserveAspectRatio="none">
        <path
          d="
            M 180 630 
            L 10 630 
            L 10 10 
            L 350 10 
            L 350 540 
            L 330 560 
            L 20 560
          "
          fill="none"
          stroke={cardData.borderColor || '#D4AF37'}
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>
      
      {/* Header - Title at the top */}
      <div className="pt-6 pb-2 text-center relative z-30">
        <h1 className="text-3xl font-bold uppercase" style={{ color: cardData.accentColor || '#D4AF37' }}>
          {cardData.teamName || 'OPEN FIRE'}
        </h1>
      </div>

      {/* Player Image - Behind text with gradient fade */}
      <div className="absolute flex w-full justify-center mt-4 z-20">
        <div className="w-100 h-90 overflow-hidden relative">
          {cardData.avatar && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={avatarSrc} 
                alt={cardData.playerName || 'Player'} 
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay for bottom fade */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-32 to-transparent" 
                style={{
                  background: `linear-gradient(to top, ${cardData.backgroundColor || '#0a2240'} 10%, rgba(0,0,0,0) 100%)`
                }}
              ></div>
            </>
          )}
          {!cardData.avatar && (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Organization Name - Large */}
      <div className="flex flex-col items-center px-6 relative z-30 mt-90">
        <h2 className="text-5xl font-bold uppercase tracking-wider" style={{ color: cardData.textColor || '#FFFFFF' }}>
          {cardData.playerName || 'ESA ESPORTS'}
        </h2>

   
        
        {/* Player Name and Title */}
        <div className="mt-2 text-center">
          <p className="text-2xl uppercase font-medium" style={{ color: cardData.textColor || '#FFFFFF' }}>
            {cardData.title || 'LALE ERGIN'}
          </p>
          <p className="text-lg uppercase mt-1" style={{ color: cardData.accentColor || '#D4AF37' }}>
            {cardData.role || 'CO-FOUNDER & CEO'}
          </p>
        </div>
      </div>
      
  

      {/* Horizontal line above stats with 10px gaps on both sides */}
      <div className="mt-5 relative z-30">
        <div className="mx-10 h-px" style={{ backgroundColor: cardData.accentColor || '#D4AF37' }}></div>
      </div>
      
      {/* Stats - Horizontal layout with dividers */}
      <div className="mt-2 mb-8 px-4 relative z-30">
        <div className="flex justify-between items-center py-4">
          {cardData.stats.map((stat, index) => (
            <div key={index} className="text-center flex-1 relative">
              {index > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-px" style={{ backgroundColor: cardData.accentColor || '#D4AF37' }}></div>
              )}
              <p className="text-xs uppercase font-medium" style={{ color: cardData.accentColor || '#D4AF37' }}>{stat.label}</p>
              <p className="text-3xl font-bold" style={{ color: cardData.textColor || '#FFFFFF' }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>


      {/* Brand Logos - Bottom - matching the image */}
      <div className="absolute bottom-9 left-0 right-0 px-8 z-30">
        {cardData.brandLogos.length > 0 ? (
          <div className="w-full flex justify-between items-center">
            {cardData.brandLogos.map((logo, index) => (
              <div key={index} className="h-10 flex-1 flex justify-center">
                {logo.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={logo.imageUrl} 
                    alt={logo.name} 
                    className="h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center">
                    {index === 0 ? (
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mr-2">
                          <span className="text-[#0a2240] text-lg font-bold">R</span>
                        </div>
                        <span className="text-white text-lg font-bold">READY2.GG</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="text-blue-400 mr-1 text-xl">≫</div>
                        <span className="text-white text-lg font-bold">BtcTurk</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-between items-center">
            <div className="flex-1 flex justify-center">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mr-2">
                  <span className="text-[#0a2240] text-lg font-bold">R</span>
                </div>
                <span className="text-white text-lg font-bold">READY2.GG</span>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center">
                <div className="text-blue-400 mr-1 text-xl">≫</div>
                <span className="text-white text-lg font-bold">BtcTurk</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Variation 2: Angled Frame Template based on provided HTML/CSS
export function AngledTemplate({ cardData, className = '' }: CardTemplateProps) {
  // Default avatar if none provided
  const avatarSrc = cardData.avatar 
    ? URL.createObjectURL(cardData.avatar) 
    : 'https://via.placeholder.com/300';

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: '2/3', 
        maxWidth: '100%',
        backgroundColor: cardData.backgroundColor || '#0a142f' 
      }}
    >
      {/* SVG Angled Frame */}
      <svg className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <polygon
          points="20,0 340,0 360,20 360,520 340,540 20,540 0,520 0,20"
          fill="none"
          stroke={cardData.borderColor || '#d4af37'}
          strokeWidth="2"
        />
      </svg>
      
      {/* Card Content */}
      <div className="relative z-20 p-6 flex flex-col h-full">
        {/* Top Label */}
        <div className="text-center font-bold text-lg tracking-wider" style={{ color: cardData.accentColor || '#f7d366' }}>
          {cardData.teamName || 'OPEN FIRE'}
        </div>

        {/* Profile Image */}
        <div className="w-36 h-36 rounded-full mx-auto mt-4 mb-3 overflow-hidden">
          {cardData.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={avatarSrc} 
              alt={cardData.playerName || 'Player'} 
              className="w-full h-full object-cover"
            />
          )}
          {!cardData.avatar && (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Team & Person Info */}
        <div className="text-center mt-2">
          <h2 className="text-2xl font-bold" style={{ color: cardData.textColor || '#FFFFFF' }}>
            {cardData.playerName || 'ESA ESPORTS'}
          </h2>
          <p className="text-base font-bold mt-1" style={{ color: cardData.textColor || '#FFFFFF' }}>
            {cardData.title || 'LALE ERGIN'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: cardData.accentColor || '#f7d366' }}>
            {cardData.role || 'CO-FOUNDER & CEO'}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 flex justify-around text-center">
          {cardData.stats.slice(0, 3).map((stat, index) => (
            <div key={index} className="flex-1">
              <p className="text-lg font-medium" style={{ color: cardData.textColor || '#FFFFFF' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: cardData.accentColor || '#d4af37' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Final Placement - Only if there's a 4th stat */}
        {cardData.stats.length > 3 && (
          <div className="text-center mt-4">
            <p className="text-lg font-medium" style={{ color: cardData.textColor || '#FFFFFF' }}>{cardData.stats[3].value}</p>
            <p className="text-xs" style={{ color: cardData.accentColor || '#d4af37' }}>{cardData.stats[3].label}</p>
          </div>
        )}

        {/* Bottom Logos */}
        <div className="absolute bottom-5 left-4 right-4 flex justify-between items-center z-30">
          {cardData.brandLogos.length > 0 ? (
            cardData.brandLogos.map((logo, index) => (
              <div key={index} className="h-6">
                {logo.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={logo.imageUrl} 
                    alt={logo.name} 
                    className="h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center">
                    {index === 0 ? (
                      <span className="text-white text-sm font-bold">READY2.GG</span>
                    ) : (
                      <span className="text-white text-sm font-bold">BtcTurk</span>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              <div className="text-white text-sm font-bold">READY2.GG</div>
              <div className="text-white text-sm font-bold">BtcTurk</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Variation 3: Esports style with diagonal elements
export function EsportsTemplate({ cardData, className = '' }: CardTemplateProps) {
  // Default avatar if none provided
  const avatarSrc = cardData.avatar 
    ? URL.createObjectURL(cardData.avatar) 
    : 'https://via.placeholder.com/300';

  return (
    <div 
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{ 
        aspectRatio: '9/16', 
        maxWidth: '100%',
        background: `linear-gradient(to bottom, ${cardData.backgroundColor || '#7f1d1d'} 0%, ${cardData.borderColor || '#f09819'} 100%)` 
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-full h-40 bg-red-600" 
             style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-blue-600" 
             style={{ clipPath: 'polygon(0 100%, 100% 100%, 0 0)' }}></div>
      </div>

      {/* Content container with z-index to appear above background */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold uppercase" style={{ color: cardData.textColor || '#FFFFFF' }}>
            {cardData.teamName || 'TEAM NAME'}
          </h1>
        </div>

        {/* Player Image and Info */}
        <div className="flex flex-col items-center px-6">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white mb-4 shadow-lg">
            {cardData.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={avatarSrc} 
                alt={cardData.playerName || 'Player'} 
                className="w-full h-full object-cover"
              />
            )}
            {!cardData.avatar && (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          <h2 className="text-4xl font-bold uppercase mt-2" style={{ color: cardData.textColor || '#FFFFFF' }}>
            {cardData.playerName || 'PLAYER NAME'}
          </h2>
          
          <p className="text-lg uppercase mt-1 text-gray-300">
            {cardData.title || 'TITLE'}
          </p>
        </div>

        {/* Stats - Centered in the middle */}
        <div className="mt-6 px-6 flex-1 flex items-center justify-center">
          <div className={`grid ${cardData.stats.length === 1 ? 'grid-cols-1' : cardData.stats.length === 2 ? 'grid-cols-2' : cardData.stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2 grid-rows-2'} w-full gap-2 text-center`}>
            {cardData.stats.map((stat, index) => (
              <div key={index} className="bg-opacity-70 p-3 rounded" style={{ backgroundColor: cardData.accentColor || '#f09819' }}>
                <p className="text-xs font-medium" style={{ color: cardData.textColor || '#f87171' }}>{stat.label}</p>
                <p className="text-3xl font-bold" style={{ color: cardData.textColor || '#FFFFFF' }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Logos */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center gap-4 bg-black">
        {cardData.brandLogos.length > 0 ? (
          cardData.brandLogos.map((logo, index) => (
            <div key={index} className="h-8">
              {logo.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={logo.imageUrl} 
                  alt={logo.name} 
                  className="h-full object-contain"
                />
              ) : (
                <div className="h-full px-3 bg-white bg-opacity-20 flex items-center rounded">
                  <span className="text-white text-xs">{logo.name}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <>
            <div className="h-8 px-4 bg-white bg-opacity-20 flex items-center rounded">
              <span className="text-white text-xs">READY2.GG</span>
            </div>
            <div className="h-8 px-4 bg-white bg-opacity-20 flex items-center rounded">
              <span className="text-white text-xs">BtcTurk</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Variation 3: Minimalist style with clean layout
// Variation 4: FIFA-style player card template
export function FifaTemplate({ cardData, className = '' }: CardTemplateProps) {
  // Default avatar if none provided
  const avatarSrc = cardData.avatar 
    ? URL.createObjectURL(cardData.avatar) 
    : 'https://via.placeholder.com/300';

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: '2/3', 
        maxWidth: '100%',
        background: `linear-gradient(135deg, ${cardData.backgroundColor || '#f09819'} 0%, ${cardData.backgroundColor ? adjustColorBrightness(cardData.backgroundColor, -30) : '#ff512f'} 100%)`,
        borderRadius: '10px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
      }}
    >
      {/* Card Overlay Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      ></div>

      {/* Rating */}
      <div className="absolute top-3 left-4 z-10">
        <div className="text-3xl font-bold" style={{ color: cardData.textColor || '#FFFFFF' }}>
          {calculateRating(cardData)}
        </div>
        <div className="text-xs uppercase font-medium tracking-wider" style={{ color: cardData.accentColor || '#FFFFFF' }}>
          {cardData.stats.length > 0 ? cardData.stats[0].label : 'KDA'}
        </div>
      </div>

      {/* Position */}
      <div className="absolute top-3 right-4 z-10">
        <div className="text-xl font-bold uppercase whitespace-normal text-right" style={{ color: cardData.textColor || '#FFFFFF' }}>
          {cardData.role || 'CEO'}
        </div>
      </div>

      {/* Player Image */}
      <div className="relative flex justify-center items-center mt-14 mb-2 z-10">
        <div className="w-44 h-44 overflow-visible">
          {cardData.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={avatarSrc} 
              alt={cardData.playerName || 'Player'} 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          )}
          {!cardData.avatar && (
            <div className="w-full h-full bg-white bg-opacity-10 flex items-center justify-center rounded-full">
              <span className="text-white">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Player Name */}
      <div className="relative px-4 mt-6 z-10">
        <div 
          className="w-full py-2 px-3 bg-opacity-90 text-center shadow-md"
          style={{ backgroundColor: `${cardData.borderColor || '#f09819'}` }}
        >
          <h2 className="text-xl font-bold uppercase truncate" style={{ color: `${cardData.textColor || '#f09819'}` }}>
            {cardData.playerName || 'PLAYER NAME'}
          </h2>
        </div>
      </div>

      {/* Stats */}
      <div className="relative px-4 mt-3 z-10">
        <div className="grid grid-cols-2 gap-3 p-4 rounded-md" style={{ backgroundColor: `${cardData.borderColor || '#f09819'}99` }}>
          {cardData.stats.slice(0, 4).map((stat, index) => (
            <div key={index} className="flex flex-col items-center py-2">
              <span className="text-lg uppercase font-bold mb-1" style={{ color: cardData.accentColor || '#FFFFFF' }}>{stat.label}</span>
              <span className="text-3xl font-extrabold" style={{ color: cardData.textColor || '#FFFFFF' }}>{stat.value}</span>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 4 - cardData.stats.length) }).map((_, index) => (
            <div key={`empty-${index}`} className="flex flex-col items-center py-2">
              <span className="text-lg uppercase font-bold mb-1 opacity-50" style={{ color: cardData.accentColor || '#FFFFFF' }}>---</span>
              <span className="text-3xl font-extrabold opacity-50" style={{ color: cardData.textColor || '#FFFFFF' }}>--</span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Logos at Bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 z-10">
        {cardData.brandLogos.length > 0 ? (
          cardData.brandLogos.slice(0, 2).map((logo, index) => (
            <div key={index} className="h-10 bg-opacity-20 px-4 py-2 rounded">
              {logo.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={logo.imageUrl} 
                  alt={logo.name} 
                  className="h-full object-contain"
                />
              ) : (
                <span className="text-white text-sm font-medium">{logo.name}</span>
              )}
            </div>
          ))
        ) : (
          <>
            <div className="h-10 bg-white bg-opacity-20 px-4 py-2 rounded">
              <span className="text-white text-sm font-medium">READY2.GG</span>
            </div>
            <div className="h-10 bg-white bg-opacity-20 px-4 py-2 rounded">
              <span className="text-white text-sm font-medium">BtcTurk</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Helper functions for the FIFA template
function calculateRating(cardData: CardTemplateProps['cardData']): string {
  if (cardData.stats.length === 0) return '90';
  
  // Try to find a numeric value in stats to use as rating
  for (const stat of cardData.stats) {
    const numericPart = parseFloat(stat.value);
    if (!isNaN(numericPart) && numericPart > 0 && numericPart <= 99) {
      return Math.round(numericPart).toString();
    }
  }
  
  // Default value
  return '90';
}

function getInitials(role: string): string {
  if (!role) return 'CEO';
  
  const words = role.split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  
  return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
}

function adjustColorBrightness(color: string, percent: number): string {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.round(R * (100 + percent) / 100);
  G = Math.round(G * (100 + percent) / 100);
  B = Math.round(B * (100 + percent) / 100);

  R = Math.min(255, Math.max(0, R));
  G = Math.min(255, Math.max(0, G));
  B = Math.min(255, Math.max(0, B));

  return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
}

export function MinimalistTemplate({ cardData, className = '' }: CardTemplateProps) {
  // Default avatar if none provided
  const avatarSrc = cardData.avatar 
    ? URL.createObjectURL(cardData.avatar) 
    : 'https://via.placeholder.com/300';

  return (
    <div className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: '9/16', backgroundColor: cardData.backgroundColor || '#f4f4f4' }}>
      
      {/* A clean horizontal line at the top */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: cardData.borderColor || '#000000' }}></div>

      {/* Team Name */}
      <div className="pt-8 pb-4 text-center">
        <h1 className="text-2xl font-light uppercase tracking-widest" style={{ color: cardData.accentColor || '#000000' }}>
          {cardData.teamName || 'TEAM NAME'}
        </h1>
      </div>

      {/* Player Image and Info */}
      <div className="flex flex-col items-center px-6 pt-4">
        <div className="w-40 h-40 rounded-lg overflow-hidden shadow-md mb-6">
          {cardData.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={avatarSrc} 
              alt={cardData.playerName || 'Player'} 
              className="w-full h-full object-cover"
            />
          )}
          {!cardData.avatar && (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        <h2 className="text-4xl font-bold uppercase text-center tracking-wide" style={{ color: cardData.textColor || '#000000' }}>
          {cardData.playerName || 'PLAYER NAME'}
        </h2>
        
        <p className="text-base uppercase mt-1 tracking-wider" style={{ color: cardData.textColor || '#000000', opacity: 0.75 }}>
          {cardData.title || 'TITLE'}
        </p>
        
        <p className="text-sm mt-1 tracking-wide" style={{ color: cardData.accentColor || '#000000' }}>
          {cardData.role || 'CO-FOUNDER & CEO'}
        </p>
      </div>

      {/* Subtle divider line */}
      <div className="mx-12 my-6 h-px bg-gray-300"></div>

      {/* Stats */}
      <div className="px-10 py-4">
        <div className={`grid ${cardData.stats.length === 1 ? 'grid-cols-1' : cardData.stats.length === 2 ? 'grid-cols-2' : cardData.stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2 gap-y-6'} gap-x-2`}>
          {cardData.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-5xl font-light" style={{ color: cardData.textColor || '#000000' }}>{stat.value}</p>
              <p className="text-xs uppercase tracking-wider mt-1" style={{ color: cardData.accentColor || '#000000' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Logos */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center">
        {cardData.brandLogos.length > 0 ? (
          cardData.brandLogos.map((logo, index) => (
            <div key={index} className="h-6">
              {logo.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={logo.imageUrl} 
                  alt={logo.name} 
                  className="h-full object-contain"
                />
              ) : (
                <div className="flex items-center">
                  <span className="text-xs font-medium opacity-70">{logo.name}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <>
            <div className="text-xs font-medium opacity-70">READY2.GG</div>
            <div className="text-xs font-medium opacity-70">BtcTurk</div>
          </>
        )}
      </div>

      {/* No Social Media Links */}
    </div>
  );
}
