import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (data: {
    brandName: string;
    industry: string;
    keywords: string[];
    style: string;
  }) => void;
  isLoading: boolean;
}

export default function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [keywords, setKeywords] = useState('');
  const [style, setStyle] = useState('modern');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !industry.trim()) return;
    
    onSubmit({
      brandName: brandName.trim(),
      industry: industry.trim(),
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      style
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
          Generate Perfect Logos in{' '}
          <span className="text-primary">Minutes</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          AI-powered logo generation for solo founders and small businesses. 
          Create professional logos with customization tools and brand kits.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-text mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Enter your brand name"
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-text mb-2">
            Industry *
          </label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select your industry</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="retail">Retail</option>
            <option value="education">Education</option>
            <option value="consulting">Consulting</option>
            <option value="creative">Creative Services</option>
            <option value="food">Food & Beverage</option>
            <option value="fitness">Fitness & Wellness</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-text mb-2">
            Keywords (optional)
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="professional, innovative, trustworthy"
            className="input-field"
          />
          <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium text-text mb-2">
            Style Preference
          </label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="input-field"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="playful">Playful</option>
            <option value="elegant">Elegant</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !brandName.trim() || !industry.trim()}
          className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span>Generating logos...</span>
          ) : (
            <>
              <span>Generate Logos</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}