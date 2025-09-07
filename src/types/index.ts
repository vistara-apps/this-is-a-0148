export interface User {
  userId: string;
  email: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  logoPreference?: string;
}

export interface LogoRequest {
  requestId: string;
  userId: string;
  promptKeywords: string[];
  generatedConcepts: GeneratedLogo[];
  selectedConcept?: string;
  customizations: LogoCustomization;
}

export interface GeneratedLogo {
  logoId: string;
  requestId: string;
  conceptDetails: {
    prompt: string;
    style: string;
    industry: string;
  };
  imageUrl: string;
  fileFormats: string[];
  colorVariations: string[];
}

export interface LogoCustomization {
  primaryColor: string;
  secondaryColor: string;
  font: string;
  size: 'small' | 'medium' | 'large';
  style: 'modern' | 'classic' | 'playful' | 'elegant';
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface AppState {
  currentStep: 'input' | 'generation' | 'customization' | 'pricing' | 'payment';
  logoRequest?: LogoRequest;
  selectedLogo?: GeneratedLogo;
  customizations: LogoCustomization;
  isGenerating: boolean;
  error?: string;
}