import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, MapPin, Clock } from "lucide-react";
import somnathTemple from "@/assets/somnath-temple.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${somnathTemple})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-background/40 to-secondary/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Floating Sacred Symbol */}
          <div className="mb-8 flex justify-center">
            <div className="animate-float p-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-sacred">
              <Sparkles className="w-12 h-12 text-secondary animate-glow" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-divine bg-clip-text text-transparent animate-shimmer">
            Sacred Journey
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Plan your divine temple visits with blessed ease
          </p>

          <div className="text-lg text-white/80 mb-12 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              <span>3 Sacred Temples</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              <span>Easy Time Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span>Divine Experience</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            variant="divine" 
            size="lg"
            onClick={() => navigate('/auth')}
            className="text-xl px-12 py-6 animate-glow"
          >
            Start Your Journey
          </Button>

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 animate-float opacity-30">
            <div className="w-4 h-4 bg-secondary rounded-full" />
          </div>
          <div className="absolute bottom-32 right-16 animate-float opacity-20" style={{ animationDelay: '2s' }}>
            <div className="w-6 h-6 bg-primary rounded-full" />
          </div>
          <div className="absolute top-40 right-32 animate-float opacity-25" style={{ animationDelay: '4s' }}>
            <div className="w-3 h-3 bg-accent rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;