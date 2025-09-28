import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, MapPin, Clock } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProfileMenu } from "@/components/ProfileMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import somnathTemple from "@/assets/somnath-temple.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useUser();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${somnathTemple})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-background/40 to-secondary/60" />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
        <LanguageSwitcher />
        {isAuthenticated && <ProfileMenu />}
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
            {t('sacred.journey')}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            {t('plan.divine.visits')}
          </p>

          <div className="text-lg text-white/80 mb-12 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              <span>{t('temples.count')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              <span>{t('easy.booking')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span>{t('divine.experience')}</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            variant="divine" 
            size="lg"
            onClick={() => navigate(isAuthenticated ? '/temples' : '/auth')}
            className="text-xl px-12 py-6 animate-glow"
          >
            {t('start.journey')}
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