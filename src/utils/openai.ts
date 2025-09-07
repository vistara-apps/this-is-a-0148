import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export interface LogoGenerationParams {
  brandName: string;
  industry: string;
  keywords: string[];
  style: string;
}

export async function generateLogoConcepts(params: LogoGenerationParams): Promise<string[]> {
  try {
    const prompt = `Create a minimalist, professional logo design for "${params.brandName}", a ${params.industry} business. Style: ${params.style}. Keywords: ${params.keywords.join(', ')}. The logo should be simple, scalable, and memorable. Focus on clean typography and geometric shapes. No complex illustrations. Make it suitable for business use.`;
    
    // Check if we have a valid API key
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'demo-key') {
      console.warn('Using demo mode - no valid OpenAI API key provided');
      // Return enhanced demo placeholder images
      return [
        `https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=${encodeURIComponent(params.brandName[0])}`,
        `https://via.placeholder.com/400x400/EF4444/FFFFFF?text=${encodeURIComponent(params.brandName.slice(0,2))}`,
        `https://via.placeholder.com/400x400/10B981/FFFFFF?text=${encodeURIComponent(params.brandName[0])}`,
        `https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=${encodeURIComponent(params.brandName.slice(0,2))}`
      ];
    }

    try {
      // Use DALL-E 3 for high-quality logo generation
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1, // DALL-E 3 only supports n=1
        size: "1024x1024",
        style: "natural",
        quality: "standard"
      });

      // Generate multiple variations by calling the API multiple times
      const imageUrls: string[] = [];
      
      for (let i = 0; i < 4; i++) {
        const variationPrompt = `${prompt} Variation ${i + 1}: ${getStyleVariation(params.style, i)}`;
        
        try {
          const variationResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: variationPrompt,
            n: 1,
            size: "1024x1024",
            style: "natural",
            quality: "standard"
          });
          
          if (variationResponse.data[0]?.url) {
            imageUrls.push(variationResponse.data[0].url);
          }
        } catch (variationError) {
          console.warn(`Failed to generate variation ${i + 1}:`, variationError);
          // Fallback to placeholder for failed variations
          imageUrls.push(`https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=${encodeURIComponent(params.brandName[0])}`);
        }
        
        // Add delay between API calls to avoid rate limiting
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return imageUrls.length > 0 ? imageUrls : [
        `https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=${encodeURIComponent(params.brandName[0])}`,
        `https://via.placeholder.com/400x400/EF4444/FFFFFF?text=${encodeURIComponent(params.brandName.slice(0,2))}`,
        `https://via.placeholder.com/400x400/10B981/FFFFFF?text=${encodeURIComponent(params.brandName[0])}`,
        `https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=${encodeURIComponent(params.brandName.slice(0,2))}`
      ];
    } catch (apiError) {
      console.warn('OpenAI API error, falling back to demo mode:', apiError);
      // Fallback to demo images if API fails
      return [
        `https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=${encodeURIComponent(params.brandName[0])}`,
        `https://via.placeholder.com/400x400/EF4444/FFFFFF?text=${encodeURIComponent(params.brandName.slice(0,2))}`,
        `https://via.placeholder.com/400x400/10B981/FFFFFF?text=${encodeURIComponent(params.brandName[0])}`,
        `https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=${encodeURIComponent(params.brandName.slice(0,2))}`
      ];
    }
  } catch (error) {
    console.error('Error generating logo concepts:', error);
    throw new Error('Failed to generate logo concepts. Please try again.');
  }
}

function getStyleVariation(baseStyle: string, index: number): string {
  const variations = {
    modern: [
      'with clean geometric shapes',
      'with bold typography',
      'with subtle gradients',
      'with minimalist icon'
    ],
    classic: [
      'with traditional serif fonts',
      'with elegant flourishes',
      'with timeless design elements',
      'with refined typography'
    ],
    playful: [
      'with rounded shapes',
      'with vibrant colors',
      'with friendly appearance',
      'with creative elements'
    ],
    elegant: [
      'with sophisticated typography',
      'with luxury feel',
      'with refined details',
      'with premium appearance'
    ]
  };

  return variations[baseStyle as keyof typeof variations]?.[index] || 'with unique design elements';
}
