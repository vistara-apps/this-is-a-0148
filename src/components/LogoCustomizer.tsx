// React import not needed with new JSX transform
import { GeneratedLogo, LogoCustomization } from '../types';
import CustomizationPanel from './CustomizationPanel';

interface LogoCustomizerProps {
  selectedLogo: GeneratedLogo;
  customizations: LogoCustomization;
  onCustomizationChange: (customizations: LogoCustomization) => void;
  onContinue: () => void;
}

export default function LogoCustomizer({
  selectedLogo,
  customizations,
  onCustomizationChange,
  onContinue
}: LogoCustomizerProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text mb-4">
          Customize Your Logo
        </h2>
        <p className="text-lg text-gray-600">
          Fine-tune your logo with colors, fonts, and styling
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-semibold text-text mb-4">Preview</h3>
            <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <img
                src={selectedLogo.imageUrl}
                alt="Logo preview"
                className="max-w-full max-h-full object-contain"
                style={{
                  filter: `hue-rotate(${customizations.primaryColor === '#3B82F6' ? '0' : '180'}deg)`
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-white border border-border rounded flex items-center justify-center p-2">
                <img src={selectedLogo.imageUrl} alt="White bg" className="max-w-full max-h-full" />
              </div>
              <div className="aspect-square bg-gray-900 border border-border rounded flex items-center justify-center p-2">
                <img src={selectedLogo.imageUrl} alt="Dark bg" className="max-w-full max-h-full" style={{ filter: 'invert(1)' }} />
              </div>
              <div className="aspect-square bg-gray-100 border border-border rounded flex items-center justify-center p-2">
                <img src={selectedLogo.imageUrl} alt="Gray bg" className="max-w-full max-h-full" />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <CustomizationPanel
            customizations={customizations}
            onChange={onCustomizationChange}
          />
          
          <div className="mt-8">
            <button onClick={onContinue} className="btn-primary w-full">
              Continue to Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
