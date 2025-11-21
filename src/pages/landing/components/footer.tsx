import { Zap, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ProjectFlow</span>
            </div>
            <p className="text-muted-foreground">
              The modern project management platform that helps teams work smarter, not harder.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Features
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Pricing
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Integrations
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                API
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                About
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Blog
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Careers
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Contact
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Help Center
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Documentation
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Status
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Security
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 ProjectFlow. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-smooth">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-smooth">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;