import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
// import ThemeToggle from "../../../components/common/theme/theme-toggle";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/theme-toggle";
// import { OnboardingModal } from "../../../components/onboarding/onboarding-modal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  return (
    <header className="top-0 right-0 left-0 z-50 fixed bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="mx-auto px-6 py-4 container">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex justify-center items-center bg-gradient-primary rounded-lg w-8 h-8">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-xl">ProjectFlow</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-smooth">
              Pricing
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-smooth">
              About
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth">
              Contact
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" asChild={true}>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button variant="default" onClick={() => {
              setShowOnboardingModal(!showOnboardingModal)
            }}>Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-4 pt-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-smooth">
                Pricing
              </a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-smooth">
                About
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth">
                Contactasdas
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost">Sign In</Button>
                <Button variant="default" onClick={() => {
                  alert("Get Started clicked!");
                  setShowOnboardingModal(!showOnboardingModal)
                }}>{showOnboardingModal ? "Yes" : "No"}</Button>
              </div>
            </nav>
          </div>
        )}
        {/* <OnboardingModal open={showOnboardingModal} onOpenChange={setShowOnboardingModal} /> */}
      </div>
    </header>
  );
};

export default Header;