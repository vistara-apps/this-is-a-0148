
import { Check, Download } from 'lucide-react';
import { GeneratedLogo } from '../types';

interface LogoPreviewCardProps {
  logo: GeneratedLogo;
  isSelected: boolean;
  onSelect: () => void;
  variant?: 'generated' | 'selected';
}

export default function LogoPreviewCard({ 
  logo, 
  isSelected, 
  onSelect, 
  variant = 'generated' 
}: LogoPreviewCardProps) {
  return (
    <div 
      className={`card cursor-pointer transition-all duration-200 hover:scale-105 ${
        isSelected 
          ? 'ring-2 ring-primary border-primary' 
          : 'hover:border-primary/50'
      }`}
      onClick={onSelect}
    >
      <div className="relative">
        <img
          src={logo.imageUrl}
          alt={`Logo concept ${logo.logoId}`}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-text">
          {logo.conceptDetails.style} Style
        </h3>
        <p className="text-sm text-gray-600">
          {logo.conceptDetails.industry} • {logo.conceptDetails.prompt.slice(0, 50)}...
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex space-x-1">
            {logo.colorVariations.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          
          {variant === 'selected' && (
            <button className="p-1 text-gray-400 hover:text-primary transition-colors">
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}