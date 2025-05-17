'use client';

import { useState } from 'react';
import { CardGeneratorProps } from '../types';

export default function CardGenerator({ cardData, onDataChange, onGenerate }: CardGeneratorProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [logoPreviewUrls, setLogoPreviewUrls] = useState<{[key: number]: string}>({});

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
          <input
            type="file"
            onChange={handleAvatarChange}
            className="w-full"
            accept="image/*"
          />
          {avatarPreview && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={avatarPreview} 
                alt="Avatar preview" 
                className="h-20 w-20 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      <hr className="my-6" />
      
      <h2 className="text-xl font-semibold text-blue-400 mt-4 sm:mt-6">Player Stats</h2>
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
      </div>

      <hr className="my-6" />
      
      <h2 className="text-xl font-semibold text-blue-400">Card Template</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
        {(['classic', 'modern', 'fifa', 'esports', 'minimalist'] as const).map((template) => (
          <div 
            key={template}
            onClick={() => onDataChange({ template })}
            className={`
              h-12 rounded-md cursor-pointer flex items-center justify-center font-medium
              ${cardData.template === template ? 'ring-2 ring-offset-2 ring-blue-500' : 'border border-gray-300'}
              ${template === 'classic' ? 'bg-blue-900 text-white' : ''}
              ${template === 'modern' ? 'bg-purple-900 text-white' : ''}
              ${template === 'fifa' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : ''}
              ${template === 'esports' ? 'bg-red-900 text-white' : ''}
              ${template === 'minimalist' ? 'bg-gray-900 text-white' : ''}
            `}
          >
            {template.charAt(0).toUpperCase() + template.slice(1)}
          </div>
        ))}
      </div>

      <hr className="my-6" />
      
      <h2 className="text-xl font-semibold text-blue-400 mt-6">Card Colors</h2>

      {/* Border Color */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-blue-400 mb-1">Border Color</label>
        <div className="flex items-center gap-3">
          <input 
            type="color" 
            value={cardData.borderColor || '#D4AF37'} 
            onChange={(e) => onDataChange({ borderColor: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <div className="flex-1">
            <input 
              type="text" 
              value={cardData.borderColor || '#D4AF37'} 
              onChange={(e) => onDataChange({ borderColor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. #D4AF37"
            />
          </div>
        </div>
      </div>

      {/* Background Color */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-blue-400 mb-1">Background Color</label>
        <div className="flex items-center gap-3">
          <input 
            type="color" 
            value={cardData.backgroundColor || '#0a2240'} 
            onChange={(e) => onDataChange({ backgroundColor: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <div className="flex-1">
            <input 
              type="text" 
              value={cardData.backgroundColor || '#0a2240'} 
              onChange={(e) => onDataChange({ backgroundColor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. #0a2240"
            />
          </div>
        </div>
      </div>
      
      {/* Text Color */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-blue-400 mb-1">Text Color</label>
        <div className="flex items-center gap-3">
          <input 
            type="color" 
            value={cardData.textColor || '#FFFFFF'} 
            onChange={(e) => onDataChange({ textColor: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <div className="flex-1">
            <input 
              type="text" 
              value={cardData.textColor || '#FFFFFF'} 
              onChange={(e) => onDataChange({ textColor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. #FFFFFF"
            />
          </div>
        </div>
      </div>
      
      {/* Accent Color */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-blue-400 mb-1">Accent Color</label>
        <div className="flex items-center gap-3">
          <input 
            type="color" 
            value={cardData.accentColor || '#F7D366'} 
            onChange={(e) => onDataChange({ accentColor: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <div className="flex-1">
            <input 
              type="text" 
              value={cardData.accentColor || '#F7D366'} 
              onChange={(e) => onDataChange({ accentColor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. #F7D366"
            />
          </div>
        </div>
      </div>

      <hr className="my-4 sm:my-6" />
      
      <h2 className="text-xl font-semibold text-blue-400">Brand Logos</h2>
      <div className="space-y-3 sm:space-y-4 mt-2 sm:mt-3">
        {cardData.brandLogos.map((logo, index) => (
          <div key={index} className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <input
                type="text"
                value={logo.name}
                onChange={(e) => handleUpdateBrandLogo(index, 'name', e.target.value)}
                className="w-full sm:w-1/3 px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brand name"
              />
              
              <div className="flex flex-1 gap-2 items-center">
                <label className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-600 bg-blue-600 text-white rounded-md hover:bg-blue-500 cursor-pointer transition text-sm sm:text-base">
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLogoImageUpload(index, e)}
                  />
                </label>
                
                {logoPreviewUrls[index] && (
                  <div className="h-10 w-10 relative overflow-hidden rounded border border-gray-600 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={logoPreviewUrls[index]} 
                      alt={logo.name || `Logo ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleRemoveBrandLogo(index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        
        <button
          onClick={handleAddBrandLogo}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Add Brand Logo
        </button>
      </div>

    {/*  <div className="mt-6 sm:mt-8">
        <button
          onClick={onGenerate}
          className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 transition text-base sm:text-lg"
        >
          Generate Tournament Card
        </button>
      </div>*/}
    </div>
  );
}
