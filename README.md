# Monad Build Showcase

A comprehensive community showcase platform built for Monad blockchain ecosystem. This web application displays and celebrates innovative projects created by the Monad community through various missions and hackathons.

## 🌟 Project Overview

The Monad Build Showcase is a modern React-based web application that serves as a centralized hub for showcasing community-driven projects built on the Monad blockchain. The platform features projects from different missions including Farcaster miniapps, visualizers, dashboards, and NFT tools/collections.

### Key Features

- **Project Gallery**: Browse through an extensive collection of community projects
- **Advanced Filtering**: Filter by missions, tags, and search by builder Twitter handles
- **Interactive UI**: Modern, responsive design with smooth animations
- **Project Details**: Comprehensive project information including live demos and GitHub links
- **Community Recognition**: Highlight winners, runner-ups, and finalists from various competitions
- **Real-time Data**: Integration with Supabase for dynamic content management

## 🏗️ Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Theme**: Next-themes for dark/light mode support

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Real-time Updates**: Supabase real-time subscriptions
- **Cloud Functions**: Supabase Edge Functions for Twitter integration and URL verification

### Development Tools
- **Linting**: ESLint with TypeScript support
- **Package Manager**: npm/bun
- **Deployment**: Lovable platform integration

## 📱 Project Categories

The showcase features projects from multiple Monad missions:

### Break Monad v2: Farcaster Edition
- **P1x3lz**: r/place style pixel art game (Winner)
- **Flappy Trump**: Flappy Bird inspired game (Runner-up)
- **Chog vs CatGirls**: Fighting game (Third Place)
- **MonTip**: Tipping miniapp (Finalist)

### Visualizer & Dashboard (Mission 4)
- **DevHub**: Monad testnet visualizer (Winner)
- **Retro Block Explorer**: Retro plane visualizer (Runner-up)
- **Monair**: Testnet visualizer (Third Place)
- **Testnet Explorer**: Dashboard with metrics (Winner - Dashboards)
- **Testnet Metrics Hub**: Comprehensive metrics dashboard (Runner-up - Dashboards)

### Make NFTs Great Again (Mission 5)
- **NFThing**: Comprehensive NFT tooling platform (Winner - Tooling)
- **MoNFT**: NFT utilities platform (Runner-up - Tooling)
- **NadTools**: NFT development tools (Third Place - Tooling)
- **Nadmon**: NFT collection platform (Winner - Collections)
- **Blonks**: Unique NFT collection (Runner-up - Collections)
- **Moodart**: Artistic NFT collection (Third Place - Collections)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm or bun package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zaki9501/monad-build-showcase.git
   cd monad-build-showcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your actual Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```
   
   **Get your Supabase credentials:**
   - Visit your [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings → API
   - Copy the Project URL and anon/public key

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

### Build for Production

```bash
npm run build
# or
bun run build
```

## 🔧 Configuration

### Environment Variables
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase anonymous/public key
- `VITE_SUPABASE_PROJECT_ID`: Supabase project identifier

### Key Configuration Files
- **`vite.config.ts`**: Vite configuration with React SWC and path aliases
- **`tailwind.config.ts`**: Tailwind CSS configuration with custom theme
- **`components.json`**: shadcn/ui component configuration
- **`tsconfig.json`**: TypeScript configuration

## 📂 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── Navigation.tsx   # Site navigation
│   ├── Hero.tsx         # Hero section
│   ├── ProjectCard.tsx  # Project display card
│   └── FilterSidebar.tsx # Filtering interface
├── pages/               # Route components
│   ├── Index.tsx        # Homepage
│   ├── ProjectDetails.tsx # Project detail page
│   ├── MonadMissions.tsx # Missions overview
│   └── NotFound.tsx     # 404 page
├── hooks/               # Custom React hooks
│   ├── useProjects.ts   # Project data management
│   ├── useTwitterProfile.ts # Twitter integration
│   └── useUrlVerification.ts # URL validation
├── data/                # Static data and mocks
│   └── mockProjects.ts  # Project data
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility libraries
└── utils/               # Helper functions
```

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS with:
- **Color Palette**: Custom HSL-based color system with CSS variables
- **Typography**: Inter font family with responsive sizing
- **Components**: Consistent styling using shadcn/ui primitives
- **Dark Mode**: Seamless theme switching with next-themes
- **Animations**: Smooth transitions and hover effects

## 🔌 API Integration

### Supabase Integration
- **Real-time Data**: Live project updates and interactions
- **Twitter Profiles**: Fetched via Supabase Edge Functions
- **URL Verification**: Automated link validation
- **Analytics**: Project view and interaction tracking

### External APIs
- **Twitter API**: Profile information and verification
- **GitHub API**: Repository preview and validation

## 🧪 Features in Detail

### Project Filtering & Search
- Filter by mission categories
- Tag-based filtering system
- Twitter handle search functionality
- Real-time results updates

### Project Cards
- Hover animations and interactions
- Social verification badges
- Live demo and GitHub links
- Builder information and profiles

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interactions
- Progressive enhancement

## 🔐 Security

This project implements several security best practices:

- **Environment Variables**: Sensitive credentials stored in environment variables
- **Input Validation**: Comprehensive validation for all user inputs
- **URL Verification**: Google Safe Browsing API integration for link safety
- **Rate Limiting**: Protected API endpoints with rate limiting
- **XSS Protection**: No use of dangerous HTML injection methods
- **CORS Configuration**: Properly configured cross-origin requests

### Security Setup
Make sure to:
1. Never commit `.env` files to version control
2. Use strong, unique credentials for production
3. Regularly update dependencies to patch vulnerabilities
4. Review and test all external URLs before adding them

## 🚀 Deployment

### Lovable Platform
The project is integrated with Lovable for easy deployment:

1. Visit the [Lovable Project](https://lovable.dev/projects/aee37ebb-dcc8-4e9d-8202-70744125e3aa)
2. Click Share → Publish
3. Custom domain configuration available in Project Settings

### Manual Deployment
For custom deployments:

```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

Compatible with:
- Vercel
- Netlify
- AWS S3/CloudFront
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use ESLint configuration
- Maintain component modularity
- Write descriptive commit messages
- Test responsive design
- Never commit sensitive credentials

## 📄 License

This project is part of the Monad ecosystem and follows open-source principles. Check the license file for specific terms.

## 🙏 Acknowledgments

- **Monad Community**: For building amazing projects
- **Mission Participants**: All the talented builders
- **Lovable Platform**: For development and hosting support
- **Open Source Libraries**: All the excellent tools that make this possible

## 📞 Support

For questions or support:
- Create an issue in this repository
- Join the Monad community Discord
- Follow project updates on social media

---

Built with ❤️ for the Monad community