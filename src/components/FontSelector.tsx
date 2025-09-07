

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const fonts = [
  { name: 'Inter', value: 'Inter, sans-serif', preview: 'Modern & Clean' },
  { name: 'Roboto', value: 'Roboto, sans-serif', preview: 'Professional' },
  { name: 'Playfair', value: 'Playfair Display, serif', preview: 'Elegant' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif', preview: 'Versatile' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif', preview: 'Friendly' },
  { name: 'Lato', value: 'Lato, sans-serif', preview: 'Corporate' }
];

export default function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text">
        Font Family
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fonts.map((font) => (
          <button
            key={font.value}
            onClick={() => onChange(font.value)}
            className={`p-4 text-left border rounded-lg transition-all duration-200 hover:border-primary ${
              value === font.value 
                ? 'border-primary bg-primary/5' 
                : 'border-border'
            }`}
          >
            <div className="font-semibold" style={{ fontFamily: font.value }}>
              {font.name}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {font.preview}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}