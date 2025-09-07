
import { Download, FileImage } from 'lucide-react';

interface DownloadButtonProps {
  variant?: 'primary' | 'secondary';
  fileType: string;
  fileName: string;
  url: string;
  size?: string;
}

export default function DownloadButton({ 
  variant = 'primary', 
  fileType, 
  fileName, 
  url,
  size 
}: DownloadButtonProps) {
  const handleDownload = () => {
    // In a real app, this would trigger the actual download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
        variant === 'primary'
          ? 'btn-primary'
          : 'btn-secondary'
      }`}
    >
      <FileImage className="h-5 w-5" />
      <div className="text-left">
        <div className="font-medium">{fileType}</div>
        {size && <div className="text-xs opacity-75">{size}</div>}
      </div>
      <Download className="h-4 w-4" />
    </button>
  );
}