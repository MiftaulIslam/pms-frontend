import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/pages/auth/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  return (
    <header className="top-0 right-0 left-0 z-50 fixed bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="mx-auto px-6 py-4 container">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex justify-center items-center bg-gradient-primary rounded-lg w-8 h-8">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-xl">Axivo</span>
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
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={`${import.meta.env.VITE_BACKEND_API}${user.avatar}`} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      localStorage.removeItem("access_token");
                      window.location.reload();
                    }}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button variant="default" onClick={() => {
                navigate("/auth");
              }}>Get Started</Button>
            )}
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
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                ) : user ? (
                  <>
                    <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </Button>
                    <Button variant="default" onClick={() => {
                      localStorage.removeItem("access_token");
                      window.location.reload();
                    }}>
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost">Sign In</Button>
                    <Button variant="default" onClick={() => {
                      navigate("/auth");
                    }}>Get Started</Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;