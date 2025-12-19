import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AuthService } from "@/services/auth-service"
import { Github, Chrome, Building2, Zap } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/pages/auth/hooks/use-auth"

const AuthPage = () => {
    const authService = new AuthService();
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            if (user.onboarded) {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/boarding", { replace: true });
            }
        }
    }, [user, loading, navigate]);


    const handleGoogleSignIn = () => {
        authService.signIn()
    }
    return (


        <main className="relative flex justify-center items-center px-4sm:py-8 md:py-12 w-full min-h-screen overflow-hidden">
            {/* Background elements - responsive positioning */}
            <div className="absolute inset-0 bg-gradient-hero opacity-5" />
            <div className="top-10 sm:top-20 left-5 sm:left-10 absolute bg-primary/10 blur-xl rounded-full w-16 sm:w-20 h-16 sm:h-20" />
            <div className="right-5 sm:right-10 bottom-10 sm:bottom-20 absolute bg-accent/10 blur-xl rounded-full w-24 sm:w-32 h-24 sm:h-32" />

            {/* Main content - responsive width */}
            <div className="z-10 relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-md">
                <Card className="bg-gradient-card shadow-card backdrop-blur-xl border rounded-xl overflow-hidden">
                    <div className="top-0 right-0 left-0 absolute bg-gradient-to-b from-primary/5 to-transparent h-full sm:h-32" />
                    {/* Card header with enhanced design - responsive spacing */}
                    <CardHeader className="relative space-y-4 sm:space-y-6 pt-8 sm:pt-12 pb-6 sm:pb-8 text-center">
                        {/* Background accent */}

                        {/* Logo/Icon - responsive sizing */}
                        <div className="relative">
                            <div className="flex justify-center items-center bg-gradient-primary shadow-glow mx-auto rounded-2xl w-14 sm:w-16 h-14 sm:h-16 rotate-3 hover:rotate-0 transition-smooth transform">
                                <Zap className="w-7 sm:w-8 h-7 sm:h-8 text-primary" />
                            </div>
                        </div>

                        {/* Title and description - responsive typography */}
                        <div className="relative space-y-2 sm:space-y-3">
                            <CardTitle className="bg-clip-text bg-gradient-to-r  from-primary to-primary-foreground  text-transparent font-bold text-2xl sm:text-3xl">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-secondary text-base sm:text-lg">
                                Sign in to your account
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5 sm:space-y-6 px-5 sm:px-8 pb-6 sm:pb-8 z-10">
                        {/* Social login buttons - responsive sizing */}
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleGoogleSignIn}
                                className="justify-start gap-2 sm:gap-3 w-full h-10 sm:h-12 font-medium text-sm sm:text-base hover:scale-[1.01] active:scale-[0.99] transition-smooth"
                            >
                                <Chrome className="w-4 sm:w-5 h-4 sm:h-5" />
                                Continue with Google
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="justify-start gap-2 sm:gap-3 w-full h-10 sm:h-12 font-medium text-sm sm:text-base hover:scale-[1.01] active:scale-[0.99] transition-smooth"
                            >
                                <Github className="w-4 sm:w-5 h-4 sm:h-5" />
                                Continue with GitHub
                            </Button>
                        </div>

                        {/* Divider - responsive spacing */}
                        <div className="relative py-3 sm:py-4">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="bg-card px-3 sm:px-4 font-medium text-muted-foreground">
                                    or
                                </span>
                            </div>
                        </div>

                        {/* SSO button - responsive sizing */}
                        <Button
                            variant="outline"
                            size="lg"
                            className="justify-start gap-2 sm:gap-3 w-full h-10 sm:h-12 font-medium text-sm sm:text-base hover:scale-[1.01] active:scale-[0.99] transition-bounce"
                        >
                            <Building2 className="w-4 sm:w-5 h-4 sm:h-5" />
                            Continue with SSO
                        </Button>

                        {/* Footer - responsive spacing and typography */}
                        <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
                            <div className="pt-3 sm:pt-4 border-t border-border">
                                <p className="mx-auto max-w-[280px] sm:max-w-none text-muted-foreground text-xs text-center leading-relaxed">
                                    By signing in, you agree to our{" "}
                                    <a href="#" className="text-primary hover:text-primary/80 hover:underline transition-colors">
                                        Terms
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-primary hover:text-primary/80 hover:underline transition-colors">
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                        </div>
                    </CardContent>

                    <div className="bottom-0 right-0 left-0 absolute bg-linear-to-t from-primary/5 to-transparent h-full sm:h-32" />
                </Card>
            </div>
        </main>


    )
}

export default AuthPage
