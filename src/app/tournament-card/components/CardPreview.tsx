'use client';

import { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
// @ts-ignore - Ignore type checking for dom-to-image
import domtoimage from 'dom-to-image';
import { CardPreviewProps } from '../types';
import CardTemplate from '@/app/tournament-card/components/CardTemplate';
import { ModernTemplate, EsportsTemplate, MinimalistTemplate, FifaTemplate } from './CardTemplateVariations';

const CardPreview = forwardRef(({ cardData }: CardPreviewProps, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Update card scale based on container width
  useEffect(() => {
    const updateCardScale = () => {
      if (containerRef.current && cardRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const cardWidth = 448; // Fixed card width
        
        // Calculate scale factor (don't scale up, only down if needed)
        const scale = Math.min(1, containerWidth / cardWidth);
        
        // Apply scale via CSS variable
        cardRef.current.style.setProperty('--card-scale', scale.toString());
      }
    };
    
    // Initial update
    updateCardScale();
    
    // Update on resize
    window.addEventListener('resize', updateCardScale);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateCardScale);
  }, []);

  // Expose the downloadCardAsImage function to the parent component
  useImperativeHandle(ref, () => ({
    downloadCardAsImage: async () => {
      if (!cardRef.current) return;
      await downloadCardAsImage();
    }
  }));

  // Function to download the card as an image
  const downloadCardAsImage = async () => {
    if (!cardRef.current) return;
    
    try {
      // Show loading state
      const loadingToast = document.createElement('div');
      loadingToast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50';
      loadingToast.textContent = 'Generating image...';
      document.body.appendChild(loadingToast);
      
      // Set specific styles for the card element to ensure proper rendering
      const originalWidth = cardRef.current.style.width;
      const originalHeight = cardRef.current.style.height;
      
      // Ensure the card has the exact dimensions we want
      cardRef.current.style.width = '448px';
      cardRef.current.style.height = '796px';
      
      // Use dom-to-image to capture the card as a PNG
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        width: 448,
        height: 796,
        style: {
          transform: 'none',
          'border-radius': '0',
          'box-shadow': 'none'
        },
        quality: 1.0,
        bgcolor: 'transparent'
      });
      
      // Restore original styles
      cardRef.current.style.width = originalWidth;
      cardRef.current.style.height = originalHeight;
      
      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `${cardData.playerName || 'tournament'}_card.png`;
      
      // Trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Remove loading toast
      document.body.removeChild(loadingToast);
      
      // Show success toast
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      successToast.textContent = 'Card saved as image!';
      document.body.appendChild(successToast);
      
      // Remove success toast after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 3000);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  // Render the appropriate template based on the selected template
  const renderTemplate = () => {
    switch(cardData.template) {
      case 'modern':
        return <ModernTemplate cardData={cardData} />;
      case 'fifa':
        return <FifaTemplate cardData={cardData} />;
      case 'esports':
        return <EsportsTemplate cardData={cardData} />;
      case 'minimalist':
        return <MinimalistTemplate cardData={cardData} />;
      case 'classic':
      default:
        return <CardTemplate cardData={cardData} />;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full overflow-auto flex justify-center">
        {/* Responsive container that preserves aspect ratio */}
        <div 
          ref={containerRef}
          className="relative"
          style={{
            width: 'min(100%, 448px)',
            margin: '0 auto',
          }}
        >
          {/* Fixed size container with consistent aspect ratio */}
          <div 
            ref={cardRef} 
            className="overflow-hidden" 
            style={{ 
              width: '448px', 
              height: '796px',
              transform: 'scale(var(--card-scale, 1))',
              transformOrigin: 'top center',
              margin: '0 auto',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col items-center">
        <button
          onClick={downloadCardAsImage}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition mb-2"
        >
          Save as Image
        </button>
        
        <p className="text-sm text-gray-500 text-center">
          This is a preview of how your tournament card will look.
        </p>
      </div>
    </div>
  );
});

export default CardPreview;
