// React import not needed with new JSX transform
import { PricingTier } from '../types';
import PricingCard from './PricingCard';

interface PricingSectionProps {
  onSelectTier: (tierId: string) => void;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic Logo',
    price: 25,
    features: [
      'AI-generated logo concepts',
      'Basic customization',
      'High-resolution PNG',
      '1 logo variation',
      'Commercial license'
    ]
  },
  {
    id: 'brand-kit',
    name: 'Logo + Brand Kit',
    price: 45,
    popular: true,
    features: [
      'Everything in Basic',
      'Multiple file formats (PNG, JPG, SVG)',
      '3 color variations',
      'Social media sizes',
      'Favicon included',
      'Brand color palette'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Package',
    price: 75,
    features: [
      'Everything in Brand Kit',
      'Logo usage guidelines',
      'Business card template',
      'Letterhead template',
      'Vector source files',
      'Priority support'
    ]
  }
];

export default function PricingSection({ onSelectTier }: PricingSectionProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-text mb-4">
          Choose Your Package
        </h2>
        <p className="text-lg text-gray-600">
          Select the perfect package for your branding needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            onSelect={onSelectTier}
            variant={tier.popular ? 'featured' : 'default'}
          />
        ))}
      </div>
    </div>
  );
}