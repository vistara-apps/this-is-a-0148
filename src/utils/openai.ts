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
    const prompt = `Create a minimalist, professional logo design for "${params.brandName}", a ${params.industry} business. Style: ${params.style}. Keywords: ${params.keywords.join(', ')}. The logo should be simple, scalable, and memorable. Focus on clean typography and geometric shapes. No complex illustrations.`;
    
    // For demo purposes, we'll return placeholder images
    // In production, you would use the OpenAI API:
    /*
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 4,
      size: "1024x1024",
      style: "natural"
    });
    return response.data.map(img => img.url || '');
    */
    
    // Demo placeholder images
    return [
      `https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=${encodeURIComponent(params.brandName[0])}`,
      `https://via.placeholder.com/400x400/EF4444/FFFFFF?text=${encodeURIComponent(params.brandName.slice(0,2))}`,
      `https://via.placeholder.com/400x400/10B981/FFFFFF?text=${encodeURIComponent(params.brandName[0])}`,
      `https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=${encodeURIComponent(params.brandName.slice(0,2))}`
    ];
  } catch (error) {
    console.error('Error generating logo concepts:', error);
    throw new Error('Failed to generate logo concepts. Please try again.');
  }
}