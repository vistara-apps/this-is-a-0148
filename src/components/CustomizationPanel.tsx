// React import not needed with new JSX transform
import { LogoCustomization } from '../types';
import ColorPicker from './ColorPicker';
import FontSelector from './FontSelector';

interface CustomizationPanelProps {
  customizations: LogoCustomization;
  onChange: (customizations: LogoCustomization) => void;
}

export default function CustomizationPanel({ customizations, onChange }: CustomizationPanelProps) {
  const updateCustomization = (key: keyof LogoCustomization, value: any) => {
    onChange({
      ...customizations,
      [key]: value
    });
  };

  return (
    <div className="card space-y-8">
      <h3 className="text-xl font-semibold text-text">Customize Your Logo</h3>
      
      <ColorPicker
        label="Primary Color"
        value={customizations.primaryColor}
        onChange={(color) => updateCustomization('primaryColor', color)}
      />
      
      <ColorPicker
        label="Secondary Color"
        value={customizations.secondaryColor}
        onChange={(color) => updateCustomization('secondaryColor', color)}
      />
      
      <FontSelector
        value={customizations.font}
        onChange={(font) => updateCustomization('font', font)}
      />
      
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text">
          Size
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['small', 'medium', 'large'].map((size) => (
            <button
              key={size}
              onClick={() => updateCustomization('size', size)}
              className={`p-3 text-center border rounded-lg transition-all duration-200 capitalize ${
                customizations.size === size 
                  ? 'border-primary bg-primary text-white' 
                  : 'border-border hover:border-primary'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text">
          Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['modern', 'classic', 'playful', 'elegant'].map((style) => (
            <button
              key={style}
              onClick={() => updateCustomization('style', style)}
              className={`p-3 text-center border rounded-lg transition-all duration-200 capitalize ${
                customizations.style === style 
                  ? 'border-primary bg-primary text-white' 
                  : 'border-border hover:border-primary'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}