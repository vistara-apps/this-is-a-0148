import { saveAs } from 'file-saver';
import { GeneratedLogo, LogoCustomization, PricingTier } from '../types';

export interface BrandKitFile {
  name: string;
  url: string;
  type: 'png' | 'jpg' | 'svg' | 'ico' | 'pdf';
  size?: string;
  description: string;
}

export interface BrandKit {
  logoFiles: BrandKitFile[];
  colorPalette: string[];
  fonts: string[];
  guidelines?: string;
}

export async function generateBrandKit(
  logo: GeneratedLogo,
  customizations: LogoCustomization,
  tier: PricingTier
): Promise<BrandKit> {
  const brandKit: BrandKit = {
    logoFiles: [],
    colorPalette: [
      customizations.primaryColor,
      customizations.secondaryColor,
      '#FFFFFF',
      '#000000'
    ],
    fonts: [customizations.font]
  };

  // Generate different logo variations based on tier
  if (tier.id === 'basic') {
    brandKit.logoFiles = [
      {
        name: 'logo-primary.png',
        url: logo.imageUrl,
        type: 'png',
        size: '1024x1024',
        description: 'Primary logo in high resolution'
      }
    ];
  } else if (tier.id === 'brand-kit') {
    brandKit.logoFiles = [
      {
        name: 'logo-primary.png',
        url: logo.imageUrl,
        type: 'png',
        size: '1024x1024',
        description: 'Primary logo in high resolution'
      },
      {
        name: 'logo-primary.jpg',
        url: logo.imageUrl,
        type: 'jpg',
        size: '1024x1024',
        description: 'Primary logo in JPEG format'
      },
      {
        name: 'logo-primary.svg',
        url: generateSVGLogo(logo, customizations),
        type: 'svg',
        description: 'Vector logo for scalability'
      },
      {
        name: 'logo-white.png',
        url: generateColorVariation(logo.imageUrl, '#FFFFFF'),
        type: 'png',
        size: '1024x1024',
        description: 'White version for dark backgrounds'
      },
      {
        name: 'logo-black.png',
        url: generateColorVariation(logo.imageUrl, '#000000'),
        type: 'png',
        size: '1024x1024',
        description: 'Black version for light backgrounds'
      },
      {
        name: 'favicon.ico',
        url: generateFavicon(logo.imageUrl),
        type: 'ico',
        size: '32x32',
        description: 'Website favicon'
      }
    ];
  } else if (tier.id === 'premium') {
    brandKit.logoFiles = [
      {
        name: 'logo-primary.png',
        url: logo.imageUrl,
        type: 'png',
        size: '1024x1024',
        description: 'Primary logo in high resolution'
      },
      {
        name: 'logo-primary.jpg',
        url: logo.imageUrl,
        type: 'jpg',
        size: '1024x1024',
        description: 'Primary logo in JPEG format'
      },
      {
        name: 'logo-primary.svg',
        url: generateSVGLogo(logo, customizations),
        type: 'svg',
        description: 'Vector logo for scalability'
      },
      {
        name: 'logo-white.png',
        url: generateColorVariation(logo.imageUrl, '#FFFFFF'),
        type: 'png',
        size: '1024x1024',
        description: 'White version for dark backgrounds'
      },
      {
        name: 'logo-black.png',
        url: generateColorVariation(logo.imageUrl, '#000000'),
        type: 'png',
        size: '1024x1024',
        description: 'Black version for light backgrounds'
      },
      {
        name: 'favicon.ico',
        url: generateFavicon(logo.imageUrl),
        type: 'ico',
        size: '32x32',
        description: 'Website favicon'
      },
      {
        name: 'brand-guidelines.pdf',
        url: await generateBrandGuidelines(logo, customizations),
        type: 'pdf',
        description: 'Complete brand usage guidelines'
      }
    ];

    brandKit.guidelines = generateUsageGuidelines(logo, customizations);
  }

  return brandKit;
}

function generateSVGLogo(logo: GeneratedLogo, customizations: LogoCustomization): string {
  // In a real application, this would generate an actual SVG
  // For demo purposes, we'll return a placeholder SVG data URL
  const svgContent = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${customizations.primaryColor}"/>
      <text x="100" y="100" text-anchor="middle" dy=".3em" 
            fill="white" font-family="${customizations.font}" font-size="48" font-weight="bold">
        ${logo.conceptDetails.prompt.charAt(0)}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
}

function generateColorVariation(originalUrl: string, color: string): string {
  // In a real application, this would process the image to change colors
  // For demo purposes, we'll return a modified placeholder URL
  const colorHex = color.replace('#', '');
  return originalUrl.replace(/\/[A-F0-9]{6}\//, `/${colorHex}/`);
}

function generateFavicon(logoUrl: string): string {
  // In a real application, this would generate an actual favicon
  // For demo purposes, we'll return a placeholder
  return logoUrl.replace('400x400', '32x32');
}

async function generateBrandGuidelines(
  logo: GeneratedLogo,
  customizations: LogoCustomization
): Promise<string> {
  // In a real application, this would generate a PDF with brand guidelines
  // For demo purposes, we'll return a placeholder PDF data URL
  const guidelines = `
    Brand Guidelines for ${logo.conceptDetails.prompt}
    
    Primary Color: ${customizations.primaryColor}
    Secondary Color: ${customizations.secondaryColor}
    Font: ${customizations.font}
    Style: ${customizations.style}
    
    Usage Guidelines:
    - Maintain minimum clear space around logo
    - Do not stretch or distort the logo
    - Use appropriate color variations for different backgrounds
    - Ensure logo is legible at all sizes
  `;
  
  // This would be replaced with actual PDF generation
  return `data:application/pdf;base64,${btoa(guidelines)}`;
}

function generateUsageGuidelines(
  logo: GeneratedLogo,
  customizations: LogoCustomization
): string {
  return `
    ## Brand Usage Guidelines

    ### Logo Style
    - Design style: ${customizations.style}
    - Reflects the brand's ${customizations.style} aesthetic

    ### Logo Variations
    - Use the primary logo on light backgrounds
    - Use the white version on dark backgrounds
    - Use the black version when color is not available

    ### Color Palette
    - Primary: ${customizations.primaryColor}
    - Secondary: ${customizations.secondaryColor}
    - Always maintain sufficient contrast

    ### Typography
    - Primary font: ${customizations.font}
    - Use consistently across all brand materials

    ### Spacing
    - Maintain clear space equal to the height of the logo
    - Never place other elements within this clear space

    ### Don'ts
    - Don't stretch or distort the logo
    - Don't use on busy backgrounds without proper contrast
    - Don't recreate or modify the logo elements
  `;
}

export async function downloadBrandKit(brandKit: BrandKit, logoName: string) {
  try {
    // In a real application, you would zip all files together
    // For demo purposes, we'll download files individually
    for (const file of brandKit.logoFiles) {
      if (file.type === 'svg' && file.url.startsWith('data:')) {
        // Handle SVG data URLs
        const blob = dataURLToBlob(file.url);
        saveAs(blob, file.name);
      } else if (file.type === 'pdf' && file.url.startsWith('data:')) {
        // Handle PDF data URLs
        const blob = dataURLToBlob(file.url);
        saveAs(blob, file.name);
      } else {
        // Handle regular URLs (would need CORS handling in production)
        try {
          const response = await fetch(file.url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const blob = await response.blob();
          saveAs(blob, file.name);
        } catch (error) {
          console.warn(`Could not download ${file.name}:`, error);
          // Continue with other files instead of failing completely
        }
      }
      
      // Add delay between downloads to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error('Error downloading brand kit:', error);
    // Don't throw error - just log it and continue
  }
}

function dataURLToBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

export async function downloadSingleFile(file: BrandKitFile) {
  try {
    if (file.url.startsWith('data:')) {
      const blob = dataURLToBlob(file.url);
      saveAs(blob, file.name);
    } else {
      const response = await fetch(file.url);
      const blob = await response.blob();
      saveAs(blob, file.name);
    }
  } catch (error) {
    console.error(`Error downloading ${file.name}:`, error);
    throw error;
  }
}
