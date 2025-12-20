import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "/hero-image.jpg";
import { useAuth } from "@/pages/auth/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { InboxStack } from "@/icons/solid";
// import { getAllIconNames } from "@/icons";
// import { getIcon, type IconComponent } from "@/icons";
const Hero = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };
  // console.log(getAllIconNames('solid'));
// const IconComp = getIcon('outline', 'AcademicCap') as IconComponent;
  return (
    <section className="relative flex justify-center items-center min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />

      {/* Content */}
      <div className="z-10 relative mx-auto px-6 py-20 container">
        <div className="items-center gap-12 grid lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center bg-primary/10 px-4 py-2 border border-primary/20 rounded-full font-medium text-primary text-sm">
                ✨ New: AI-powered task automation
              </div>

              <h1 className="font-bold text-foreground text-5xl lg:text-6xl leading-tight">
                Manage Projects
                <span className="block bg-clip-text bg-linear-to-r  from-primary to-primary-foreground  text-transparent">
                  Like Never Before
                </span>
              </h1>

              <p className="max-w-lg text-muted-foreground text-xl leading-relaxed">
                Streamline your workflow with our powerful project management platform.
                Built for teams that want to move fast and stay organized.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex sm:flex-row flex-col gap-4">
              <Button variant="default" onClick={handleGetStarted} size="lg" className="group">
                {loading ? "Loading..." : user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button variant="outline" size="lg" className="group">
                <Play className="w-4 h-4" />
                Watch Demo
              </Button>
              <InboxStack color="#60A5FA"/>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-8 pt-8">
              <div>
                <div className="font-bold text-foreground text-2xl">10k+</div>
                <div className="text-muted-foreground text-sm">Active Teams</div>
              </div>
              <div>
                <div className="font-bold text-foreground text-2xl">99.9%</div>
                <div className="text-muted-foreground text-sm">Uptime</div>
              </div>
              <div>
                <div className="font-bold text-foreground text-2xl">24/7</div>
                <div className="text-muted-foreground text-sm">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-2xl rounded-3xl" />

              {/* Main image container */}
              <div className="relative bg-gradient-card shadow-card p-2 rounded-2xl">
                <img
                  src={heroImage}
                  alt="Project Management Dashboard"
                  className="shadow-elegant rounded-xl w-full h-auto"
                />
              </div>

              {/* Floating elements */}
              <div className="-top-4 -right-4 absolute bg-gradient-primary shadow-glow p-4 rounded-xl animate-bounce">
                <div className="font-semibold text-primary-foreground text-sm bg-primary p-3 rounded-lg">
                  Task Completed!
                </div>
              </div>

              <div className="-bottom-4 -left-4 absolute bg-card shadow-card p-4 border border-border rounded-xl">
                <div className="font-semibold text-foreground text-sm">
                  Team Productivity
                </div>
                <div className="font-bold text-primary text-lg">+185%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="top-20 left-10 absolute bg-primary/10 blur-xl rounded-full w-20 h-20" />
      <div className="right-10 bottom-20 absolute bg-accent/10 blur-xl rounded-full w-32 h-32" />
    </section>
  );
};

export default Hero;