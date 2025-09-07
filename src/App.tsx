import React, { useState, useCallback } from 'react';
import { GeneratedLogo, LogoCustomization, AppState } from './types';
import { generateLogoConcepts, LogoGenerationParams } from './utils/openai';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import LogoGeneration from './components/LogoGeneration';
import LogoCustomizer from './components/LogoCustomizer';
import PricingSection from './components/PricingSection';
import DownloadButton from './components/DownloadButton';

const defaultCustomizations: LogoCustomization = {
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  font: 'Inter, sans-serif',
  size: 'medium',
  style: 'modern'
};

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 'input',
    customizations: defaultCustomizations,
    isGenerating: false
  });

  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<GeneratedLogo | undefined>();

  const handleLogoGeneration = useCallback(async (params: LogoGenerationParams) => {
    setAppState(prev => ({ ...prev, isGenerating: true, error: undefined }));
    
    try {
      const imageUrls = await generateLogoConcepts(params);
      
      const logos: GeneratedLogo[] = imageUrls.map((url, index) => ({
        logoId: `logo-${Date.now()}-${index}`,
        requestId: `request-${Date.now()}`,
        conceptDetails: {
          prompt: `${params.brandName} ${params.industry} logo`,
          style: params.style,
          industry: params.industry
        },
        imageUrl: url,
        fileFormats: ['PNG', 'JPG', 'SVG'],
        colorVariations: ['#3B82F6', '#EF4444', '#10B981']
      }));
      
      setGeneratedLogos(logos);
      setAppState(prev => ({ 
        ...prev, 
        currentStep: 'generation',
        isGenerating: false 
      }));
    } catch (error) {
      setAppState(prev => ({ 
        ...prev, 
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate logos'
      }));
    }
  }, []);

  const handleLogoSelection = useCallback((logo: GeneratedLogo) => {
    setSelectedLogo(logo);
  }, []);

  const handleContinueToCustomization = useCallback(() => {
    setAppState(prev => ({ ...prev, currentStep: 'customization' }));
  }, []);

  const handleCustomizationChange = useCallback((customizations: LogoCustomization) => {
    setAppState(prev => ({ ...prev, customizations }));
  }, []);

  const handleContinueToPricing = useCallback(() => {
    setAppState(prev => ({ ...prev, currentStep: 'pricing' }));
  }, []);

  const handleTierSelection = useCallback((tierId: string) => {
    // In a real app, this would integrate with Stripe
    console.log('Selected tier:', tierId);
    setAppState(prev => ({ ...prev, currentStep: 'payment' }));
  }, []);

  const renderCurrentStep = () => {
    switch (appState.currentStep) {
      case 'input':
        return (
          <PromptInput
            onSubmit={handleLogoGeneration}
            isLoading={appState.isGenerating}
          />
        );
      
      case 'generation':
        return (
          <LogoGeneration
            logos={generatedLogos}
            selectedLogo={selectedLogo}
            onSelectLogo={handleLogoSelection}
            onContinue={handleContinueToCustomization}
            isLoading={appState.isGenerating}
          />
        );
      
      case 'customization':
        return selectedLogo ? (
          <LogoCustomizer
            selectedLogo={selectedLogo}
            customizations={appState.customizations}
            onCustomizationChange={handleCustomizationChange}
            onContinue={handleContinueToPricing}
          />
        ) : null;
      
      case 'pricing':
        return <PricingSection onSelectTier={handleTierSelection} />;
      
      case 'payment':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="card">
              <h2 className="text-3xl font-bold text-text mb-4">
                🎉 Payment Successful!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your logo package is ready for download.
              </p>
              
              <div className="space-y-4 mb-8">
                <DownloadButton
                  fileType="PNG (High-res)"
                  fileName="logo.png"
                  url={selectedLogo?.imageUrl || ''}
                  size="2000x2000px"
                  variant="primary"
                />
                <DownloadButton
                  fileType="SVG (Vector)"
                  fileName="logo.svg"
                  url={selectedLogo?.imageUrl || ''}
                  size="Scalable"
                  variant="secondary"
                />
                <DownloadButton
                  fileType="Favicon"
                  fileName="favicon.ico"
                  url={selectedLogo?.imageUrl || ''}
                  size="32x32px"
                  variant="secondary"
                />
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                Create Another Logo
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {appState.error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {appState.error}
            </div>
          </div>
        )}
        
        {renderCurrentStep()}
      </main>
      
      <footer className="bg-surface border-t border-border py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2024 LogoSpark. Generate perfect logos in minutes.</p>
        </div>
      </footer>
    </div>
  );
}