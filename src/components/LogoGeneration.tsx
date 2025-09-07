
import { GeneratedLogo } from '../types';
import LogoPreviewCard from './LogoPreviewCard';

interface LogoGenerationProps {
  logos: GeneratedLogo[];
  selectedLogo?: GeneratedLogo;
  onSelectLogo: (logo: GeneratedLogo) => void;
  onContinue: () => void;
  isLoading: boolean;
}

export default function LogoGeneration({ 
  logos, 
  selectedLogo, 
  onSelectLogo, 
  onContinue,
  isLoading 
}: LogoGenerationProps) {
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="text-2xl font-semibold text-text mb-4">
            Generating your logos...
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card">
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text mb-4">
          Choose Your Favorite Logo
        </h2>
        <p className="text-lg text-gray-600">
          Select a logo concept to customize and download
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {logos.map((logo) => (
          <LogoPreviewCard
            key={logo.logoId}
            logo={logo}
            isSelected={selectedLogo?.logoId === logo.logoId}
            onSelect={() => onSelectLogo(logo)}
            variant="generated"
          />
        ))}
      </div>
      
      {selectedLogo && (
        <div className="text-center">
          <button onClick={onContinue} className="btn-primary">
            Customize This Logo
          </button>
        </div>
      )}
    </div>
  );
}