import { useState, useCallback, useEffect } from 'react';
import { GeneratedLogo, LogoCustomization, AppState, PricingTier } from './types';
import { generateLogoConcepts, LogoGenerationParams } from './utils/openai';
import { processPayment } from './utils/stripe';
import { generateBrandKit, downloadBrandKit, BrandKit } from './utils/brandKit';
import { getCurrentUser } from './utils/supabase';
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
  const [selectedTier, setSelectedTier] = useState<PricingTier | undefined>();
  const [brandKit, setBrandKit] = useState<BrandKit | undefined>();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Check for authenticated user on app load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.log('No authenticated user');
      }
    };
    checkUser();
  }, []);

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

  const handleTierSelection = useCallback(async (tierId: string) => {
    if (!selectedLogo) return;

    // Find the selected tier
    const pricingTiers = [
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

    const tier = pricingTiers.find(t => t.id === tierId);
    if (!tier) return;

    setSelectedTier(tier);
    setIsProcessingPayment(true);

    try {
      // Generate brand kit
      const kit = await generateBrandKit(selectedLogo, appState.customizations, tier);
      setBrandKit(kit);

      // Process payment (demo mode)
      const userId = currentUser?.id || 'demo-user';
      await processPayment(tierId, selectedLogo.logoId, userId, tier);

      setAppState(prev => ({ ...prev, currentStep: 'payment' }));
    } catch (error) {
      console.error('Payment processing error:', error);
      setAppState(prev => ({ 
        ...prev, 
        error: 'Payment processing failed. Please try again.' 
      }));
    } finally {
      setIsProcessingPayment(false);
    }
  }, [selectedLogo, appState.customizations, currentUser]);

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
        return (
          <div className="max-w-6xl mx-auto">
            <PricingSection onSelectTier={handleTierSelection} />
            {isProcessingPayment && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-lg font-semibold">Processing your payment...</p>
                  <p className="text-gray-600">Please wait while we prepare your brand kit.</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'payment':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="card">
                <h2 className="text-3xl font-bold text-text mb-4">
                  🎉 Payment Successful!
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Your {selectedTier?.name} package is ready for download.
                </p>
                {brandKit && (
                  <div className="text-sm text-gray-500 mb-8">
                    Package includes {brandKit.logoFiles.length} files
                  </div>
                )}
              </div>
            </div>

            {brandKit && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {brandKit.logoFiles.map((file, index) => (
                  <div key={index} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-text">{file.name}</h3>
                        <p className="text-sm text-gray-600">{file.description}</p>
                        {file.size && (
                          <p className="text-xs text-gray-500">{file.size}</p>
                        )}
                      </div>
                      <div className="text-2xl">
                        {file.type === 'png' && '🖼️'}
                        {file.type === 'jpg' && '📷'}
                        {file.type === 'svg' && '🎨'}
                        {file.type === 'ico' && '🌐'}
                        {file.type === 'pdf' && '📄'}
                      </div>
                    </div>
                    <DownloadButton
                      fileType={file.type.toUpperCase()}
                      fileName={file.name}
                      url={file.url}
                      size={file.size || 'N/A'}
                      variant="secondary"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="text-center space-y-4">
              {brandKit && (
                <button
                  onClick={() => downloadBrandKit(brandKit, selectedLogo?.conceptDetails.prompt || 'logo')}
                  className="btn-primary mr-4"
                >
                  Download Complete Brand Kit
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                Create Another Logo
              </button>
            </div>

            {brandKit?.guidelines && (
              <div className="mt-12 card">
                <h3 className="text-xl font-bold text-text mb-4">Brand Guidelines</h3>
                <div className="prose prose-sm max-w-none text-gray-600">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {brandKit.guidelines}
                  </pre>
                </div>
              </div>
            )}
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
