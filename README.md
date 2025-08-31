# 🚀 Monad Community Builds Showcase

A modern, open-source platform for discovering and showcasing innovative projects built by the Monad community during missions. From DeFi protocols to NFT platforms, explore what builders are creating on the fastest EVM blockchain.

![Monad Community Builds](https://img.shields.io/badge/Monad-Community%20Builds-blue?style=for-the-badge&logo=ethereum)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.1-purple?style=for-the-badge&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2.51.0-green?style=for-the-badge&logo=supabase)

## ✨ Features

- 🎯 **Mission-Based Discovery** - Browse projects by Monad missions
- 🔍 **Advanced Filtering** - Filter by tags, builders, and search by X (Twitter) usernames
- 📊 **Project Analytics** - View engagement metrics, ratings, and project details
- 🎨 **Modern UI/UX** - Beautiful, responsive design with dark/light mode
- 🔗 **URL Verification** - Automatic verification of live URLs and GitHub repositories
- 🐦 **Twitter Integration** - Fetch and display Twitter profile data
- 📱 **Mobile Responsive** - Optimized for all device sizes
- ⚡ **Real-time Updates** - Live data from Supabase backend

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling with validation

### Backend
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Supabase Edge Functions** - Serverless functions for Twitter API integration
- **Row Level Security (RLS)** - Secure data access

### External APIs
- **Twitter API** - Fetch user profile data and verification status
- **GitHub API** - Repository information and verification

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Twitter API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/monad-build-showcase.git
   cd monad-build-showcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Add your environment variables to `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`


## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Hero.tsx        # Landing page hero section
│   ├── Navigation.tsx  # Main navigation
│   ├── ProjectCard.tsx # Project display cards
│   └── ...
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   ├── ProjectDetails.tsx # Project detail page
│   └── MonadMissions.tsx  # Missions page
├── hooks/              # Custom React hooks
├── data/               # Mock data and constants
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
└── utils/              # Helper functions
```

## 🎯 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. The `vercel.json` file is already configured for client-side routing
4. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commits
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monad](https://monad.xyz/) - The fastest EVM blockchain
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Vite](https://vitejs.dev/) - Fast build tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS


## 🔗 Links

- 🌐 Live Demo: https://monad-build-showcase.vercel.app/


---

<div align="center">
  <p>Built with ❤️ by the Monad Community</p>
  <p>
    <a href="https://monad.xyz">Monad</a> •
    <a href="https://github.com/zaki9501/monad-build-showcase">GitHub</a> •
    <a href="https://x.com/Piki_eth">Twitter</a>
  </p>
</div>
