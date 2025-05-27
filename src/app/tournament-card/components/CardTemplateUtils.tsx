import { CardData, CardTemplateProps } from '../types';

/**
 * Gets the avatar source URL based on available image sources
 * Prioritizes playerImage from API, then falls back to uploaded avatar, then placeholder
 */
export function getAvatarSrc(cardData: CardData): string {
  if (cardData.playerImage) {
    return cardData.playerImage;
  } else if (cardData.avatar) {
    return URL.createObjectURL(cardData.avatar);
  } else {
    return 'https://via.placeholder.com/300';
  }
}

/**
 * Checks if the card has any image (either playerImage from API or uploaded avatar)
 */
export function hasImage(cardData: CardData): boolean {
  return Boolean(cardData.playerImage || cardData.avatar);
}

/**
 * Renders an image or placeholder based on the card data
 * @param cardData The card data containing image information
 * @param className Optional additional CSS classes
 * @returns JSX element with the image or placeholder
 */
export function renderPlayerImage(cardData: CardData, className: string = 'w-full h-full object-cover') {
  const avatarSrc = getAvatarSrc(cardData);
  const hasPlayerImage = hasImage(cardData);
  
  if (hasPlayerImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={avatarSrc} 
        alt={cardData.playerName || 'Player'} 
        className={className}
      />
    );
  } else {
    return (
      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }
}

/**
 * Helper function to initialize a template with common utilities
 * @param props The template props
 * @returns Common utilities for templates
 */
export function useTemplateUtils(props: CardTemplateProps) {
  const { cardData } = props;
  const avatarSrc = getAvatarSrc(cardData);
  const hasPlayerImage = hasImage(cardData);
  
  return {
    avatarSrc,
    hasPlayerImage,
    renderPlayerImage: (className?: string) => renderPlayerImage(cardData, className)
  };
}
