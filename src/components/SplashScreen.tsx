import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/infiniServe-hero.jpg";
import logo from "@/assets/infiniServe-logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-glow/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center px-6 transition-all duration-1000 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img 
            src={logo} 
            alt="InfiniServe"
            className="h-20 w-auto glow-effect"
          />
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
          InfiniServe
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-2">
          Your Digital Twin, Your Voice
        </p>

        {/* Description */}
        <p className="text-lg text-muted-foreground/80 mb-12 max-w-md mx-auto">
          Experience the future of AI conversation and brand collaboration through your intelligent digital twin.
        </p>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button 
            size="lg" 
            onClick={onComplete}
            className="group bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-semibold rounded-2xl"
          >
            <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin transition-transform" />
            Begin Your Journey
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="text-sm text-muted-foreground/60">
            Powered by Advanced AI & Digital Twin Technology
          </div>
        </div>

        {/* Subtle animation indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full">
            <div className="w-1 h-3 bg-primary-glow rounded-full mx-auto mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;