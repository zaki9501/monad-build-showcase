import { Github, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="container px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-lg">Monad Showcase</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Discover and showcase innovative projects built by the Monad community. 
              Built for builders, by builders.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Platform</h3>
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Explore Projects
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Submit Project
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Mission Guidelines
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Builder Resources
              </a>
            </div>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Community</h3>
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Discord Server
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Twitter Community
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                GitHub Repos
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Documentation
              </a>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Connect</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                <Github className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Join our community of builders and start creating on Monad today.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 Monad Community Showcase. Built with ❤️ by the community.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;