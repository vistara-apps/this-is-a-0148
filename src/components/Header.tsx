// React import not needed with new JSX transform
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-text">LogoSpark</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-text hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-text hover:text-primary transition-colors">Pricing</a>
            <a href="#examples" className="text-text hover:text-primary transition-colors">Examples</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
