// React import not needed with new JSX transform
import { Check, Star } from 'lucide-react';
import { PricingTier } from '../types';

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (tierId: string) => void;
  variant?: 'default' | 'featured';
}

export default function PricingCard({ tier, onSelect, variant = 'default' }: PricingCardProps) {
  const isFeatured = variant === 'featured' || tier.popular;

  return (
    <div className={`card relative transition-all duration-200 hover:scale-105 ${
      isFeatured ? 'border-primary ring-2 ring-primary/20' : ''
    }`}>
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>Most Popular</span>
          </div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-text mb-2">{tier.name}</h3>
        <div className="text-4xl font-bold text-primary mb-1">
          ${tier.price}
        </div>
        <p className="text-gray-600">One-time payment</p>
      </div>
      
      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => onSelect(tier.id)}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
          isFeatured
            ? 'bg-primary text-white hover:bg-blue-600'
            : 'bg-gray-100 text-text hover:bg-gray-200'
        }`}
      >
        Choose {tier.name}
      </button>
    </div>
  );
}