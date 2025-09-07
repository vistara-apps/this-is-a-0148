import { describe, it, expect, vi } from 'vitest';
import { generateBrandKit, downloadBrandKit } from '../brandKit';
import { GeneratedLogo, LogoCustomization, PricingTier } from '../../types';

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

describe('Brand Kit Generation', () => {
  const mockLogo: GeneratedLogo = {
    logoId: 'test-logo-1',
    requestId: 'test-request-1',
    conceptDetails: {
      prompt: 'TechStart Technology logo',
      style: 'modern',
      industry: 'Technology'
    },
    imageUrl: 'https://example.com/logo.png',
    fileFormats: ['PNG', 'JPG', 'SVG'],
    colorVariations: ['#3B82F6', '#EF4444', '#10B981']
  };

  const mockCustomizations: LogoCustomization = {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    font: 'Inter, sans-serif',
    size: 'medium',
    style: 'modern'
  };

  const basicTier: PricingTier = {
    id: 'basic',
    name: 'Basic Logo',
    price: 25,
    features: ['High-resolution PNG', 'Basic customization']
  };

  const brandKitTier: PricingTier = {
    id: 'brand-kit',
    name: 'Logo + Brand Kit',
    price: 45,
    popular: true,
    features: ['Multiple formats', 'Color variations', 'Favicon']
  };

  const premiumTier: PricingTier = {
    id: 'premium',
    name: 'Premium Package',
    price: 75,
    features: ['Everything in Brand Kit', 'Usage guidelines', 'Templates']
  };

  it('should generate basic brand kit with single PNG file', async () => {
    const brandKit = await generateBrandKit(mockLogo, mockCustomizations, basicTier);

    expect(brandKit.logoFiles).toHaveLength(1);
    expect(brandKit.logoFiles[0].name).toBe('logo-primary.png');
    expect(brandKit.logoFiles[0].type).toBe('png');
    expect(brandKit.colorPalette).toContain('#3B82F6');
    expect(brandKit.colorPalette).toContain('#10B981');
    expect(brandKit.fonts).toContain('Inter, sans-serif');
  });

  it('should generate brand kit with multiple files for brand-kit tier', async () => {
    const brandKit = await generateBrandKit(mockLogo, mockCustomizations, brandKitTier);

    expect(brandKit.logoFiles.length).toBeGreaterThan(1);
    
    const fileTypes = brandKit.logoFiles.map(file => file.type);
    expect(fileTypes).toContain('png');
    expect(fileTypes).toContain('jpg');
    expect(fileTypes).toContain('svg');
    expect(fileTypes).toContain('ico');

    const fileNames = brandKit.logoFiles.map(file => file.name);
    expect(fileNames).toContain('logo-primary.png');
    expect(fileNames).toContain('logo-white.png');
    expect(fileNames).toContain('logo-black.png');
    expect(fileNames).toContain('favicon.ico');
  });

  it('should generate premium brand kit with guidelines', async () => {
    const brandKit = await generateBrandKit(mockLogo, mockCustomizations, premiumTier);

    expect(brandKit.logoFiles.length).toBeGreaterThan(5);
    expect(brandKit.guidelines).toBeDefined();
    expect(brandKit.guidelines).toContain('Brand Usage Guidelines');
    
    const pdfFile = brandKit.logoFiles.find(file => file.type === 'pdf');
    expect(pdfFile).toBeDefined();
    expect(pdfFile?.name).toBe('brand-guidelines.pdf');
  });

  it('should include correct color palette', async () => {
    const brandKit = await generateBrandKit(mockLogo, mockCustomizations, basicTier);

    expect(brandKit.colorPalette).toEqual([
      '#3B82F6', // Primary
      '#10B981', // Secondary
      '#FFFFFF', // White
      '#000000'  // Black
    ]);
  });

  it('should include font information', async () => {
    const brandKit = await generateBrandKit(mockLogo, mockCustomizations, basicTier);

    expect(brandKit.fonts).toContain('Inter, sans-serif');
  });

  it('should generate SVG with correct content', async () => {
    const brandKit = await generateBrandKit(mockLogo, mockCustomizations, brandKitTier);
    
    const svgFile = brandKit.logoFiles.find(file => file.type === 'svg');
    expect(svgFile).toBeDefined();
    expect(svgFile?.url).toContain('data:image/svg+xml;base64,');
  });

  it('should handle different logo styles', async () => {
    const classicCustomizations: LogoCustomization = {
      ...mockCustomizations,
      style: 'classic'
    };

    const brandKit = await generateBrandKit(mockLogo, classicCustomizations, premiumTier);
    expect(brandKit.guidelines).toContain('classic');
  });

  it('should generate unique file names', async () => {
    const brandKit = await generateBrandKit(mockLogo, mockCustomizations, brandKitTier);
    
    const fileNames = brandKit.logoFiles.map(file => file.name);
    const uniqueNames = new Set(fileNames);
    
    expect(fileNames.length).toBe(uniqueNames.size);
  });

  it('should include file descriptions', async () => {
    const brandKit = await generateBrandKit(mockLogo, mockCustomizations, brandKitTier);
    
    brandKit.logoFiles.forEach(file => {
      expect(file.description).toBeDefined();
      expect(file.description.length).toBeGreaterThan(0);
    });
  });
});

describe('Brand Kit Download', () => {
  it('should handle download errors gracefully', async () => {
    const mockBrandKit = {
      logoFiles: [
        {
          name: 'test-logo.png',
          url: 'invalid-url',
          type: 'png' as const,
          description: 'Test logo'
        }
      ],
      colorPalette: ['#000000'],
      fonts: ['Arial']
    };

    // Should not throw error
    await expect(downloadBrandKit(mockBrandKit, 'test-logo')).resolves.not.toThrow();
  });
});
