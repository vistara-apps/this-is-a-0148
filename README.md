# LogoSpark 🎨

**Generate and perfect your brand's visual identity in minutes.**

LogoSpark is a modern web application that helps solo founders and small businesses quickly generate, customize, and receive essential logo files for branding using AI-powered logo generation.

## ✨ Features

### 🤖 AI-Powered Logo Generation
- Generate multiple unique logo concepts based on your industry, brand name, and keywords
- Powered by OpenAI's DALL-E 3 for high-quality, professional results
- Multiple style variations (modern, classic, playful, elegant)

### 🎨 Customizable Logo Templates
- Customize colors, fonts, and design elements
- Real-time preview of changes
- Professional color palette suggestions

### 📦 Brand Kit Generation
- **Basic Package ($25)**: High-resolution PNG, basic customization, commercial license
- **Brand Kit Package ($45)**: Multiple formats (PNG, JPG, SVG), color variations, favicon, social media sizes
- **Premium Package ($75)**: Everything in Brand Kit plus usage guidelines, business templates, vector files

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional - demo mode available)
- Supabase account (optional - for user management)
- Stripe account (optional - for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-0148.git
   cd this-is-a-0148
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   # OpenAI Configuration (optional - demo mode available)
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   
   # Supabase Configuration (optional)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # Stripe Configuration (optional)
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **AI Integration**: OpenAI DALL-E 3 API
- **Backend**: Supabase (Authentication, Database, Storage)
- **Payments**: Stripe
- **File Processing**: Canvas API for logo variations

### Project Structure
```
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── PromptInput.tsx
│   ├── LogoGeneration.tsx
│   ├── LogoCustomizer.tsx
│   ├── PricingSection.tsx
│   └── DownloadButton.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── openai.ts       # OpenAI API integration
│   ├── supabase.ts     # Supabase client & functions
│   ├── stripe.ts       # Stripe payment processing
│   └── brandKit.ts     # Brand kit generation
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🎯 User Flow

1. **Input**: User enters brand name, industry, and keywords
2. **Generation**: AI generates 4 unique logo concepts
3. **Selection**: User selects their preferred logo concept
4. **Customization**: User customizes colors, fonts, and style
5. **Pricing**: User selects a pricing tier (Basic/Brand Kit/Premium)
6. **Payment**: Secure payment processing via Stripe
7. **Download**: User receives complete brand kit with multiple file formats

## 🔧 Configuration

### OpenAI Setup
1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to your `.env` file as `VITE_OPENAI_API_KEY`
3. The app will fall back to demo mode if no key is provided

### Supabase Setup
1. Create a project at [Supabase](https://supabase.com/)
2. Set up the following tables:

```sql
-- Users table
CREATE TABLE users (
  userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  paymentStatus TEXT DEFAULT 'pending',
  logoPreference TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Logo requests table
CREATE TABLE logo_requests (
  requestId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(userId),
  promptKeywords TEXT[],
  selectedConcept TEXT,
  customizations JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generated logos table
CREATE TABLE generated_logos (
  logoId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requestId UUID REFERENCES logo_requests(requestId),
  conceptDetails JSONB,
  imageUrl TEXT,
  fileFormats TEXT[],
  colorVariations TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Stripe Setup
1. Create a Stripe account
2. Get your publishable key from the dashboard
3. Set up webhook endpoints for payment confirmation
4. Add products and prices in Stripe dashboard

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

### Colors
- **Background**: `hsl(220, 10%, 98%)`
- **Text**: `hsl(220, 15%, 25%)`
- **Primary**: `hsl(220, 80%, 50%)`
- **Accent**: `hsl(30, 90%, 50%)`
- **Surface**: `hsl(0, 0%, 100%)`
- **Border**: `hsl(220, 10%, 85%)`

### Typography
- **Display**: 48px, bold
- **Headline**: 24px, semibold
- **Body**: 16px, regular
- **Caption**: 14px, gray-600

### Components
- **Cards**: Rounded corners (12px), subtle shadow
- **Buttons**: Primary (blue) and secondary (white) variants
- **Inputs**: Clean, focused states with primary color

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Streamlined interface for small screens

## 🔒 Security

- Environment variables for sensitive API keys
- Supabase Row Level Security (RLS) policies
- Stripe secure payment processing
- Input validation and sanitization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Docker
```bash
# Build the image
docker build -t logospark .

# Run the container
docker run -p 3000:3000 logospark
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Email**: Contact support for urgent issues

## 🎯 Roadmap

- [ ] Advanced logo editing tools
- [ ] Team collaboration features
- [ ] Brand asset management
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and insights

---

**Built with ❤️ for entrepreneurs and small businesses**
