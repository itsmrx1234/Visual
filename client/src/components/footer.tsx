import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">VisualMatch</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Find visually similar products with AI-powered search technology.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 bg-muted hover:bg-accent"
                data-testid="button-social-twitter"
              >
                <i className="fab fa-twitter text-muted-foreground text-sm"></i>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 bg-muted hover:bg-accent"
                data-testid="button-social-github"
              >
                <i className="fab fa-github text-muted-foreground text-sm"></i>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 bg-muted hover:bg-accent"
                data-testid="button-social-linkedin"
              >
                <i className="fab fa-linkedin text-muted-foreground text-sm"></i>
              </Button>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Product</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-features">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-api">API</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-pricing">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-docs">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-about">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-blog">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-careers">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Legal</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-privacy">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-terms">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-cookies">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-gdpr">GDPR</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 VisualMatch. All rights reserved. Built with AI technology.</p>
        </div>
      </div>
    </footer>
  );
}
