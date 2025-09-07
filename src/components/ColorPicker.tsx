// React import not needed with new JSX transform

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

export default function ColorPicker({ 
  label, 
  value, 
  onChange, 
  presetColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ]
}: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text">
        {label}
      </label>
      
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-md border border-border cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field flex-1"
          placeholder="#000000"
        />
      </div>
      
      <div className="grid grid-cols-8 gap-2">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-md border-2 transition-all duration-200 hover:scale-110 ${
              value === color ? 'border-gray-800' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}