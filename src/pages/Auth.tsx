import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Lock, Sparkles, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'register') => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string || email.split('@')[0];
    const phone = formData.get('phone') as string || '+91 9876543210';
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Create user object
      const userData = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone,
        isAdmin: isAdminLogin
      };
      
      login(userData);
      
      toast({
        title: type === 'login' ? t('welcome.back') : "Registration successful!",
        description: isAdminLogin ? "Redirecting to admin dashboard..." : "Redirecting to temple selection...",
      });
      
      navigate(isAdminLogin ? '/admin' : '/temples');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-spiritual relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">{t('sacred.journey')}</h1>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <Card className="shadow-ethereal border-primary/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-divine bg-clip-text text-transparent">
                {t('join.divine.journey')}
              </CardTitle>
              <CardDescription>
                {t('enter.details')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">{t('login')}</TabsTrigger>
                  <TabsTrigger value="register">{t('register')}</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">{t('password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="admin-login"
                        checked={isAdminLogin}
                        onCheckedChange={(checked) => setIsAdminLogin(checked === true)}
                      />
                      <Label htmlFor="admin-login" className="text-sm flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        {t('admin.login')}
                      </Label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="divine" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : t('sign.in')}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('full.name')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Your full name"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-register">{t('email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email-register"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('phone')}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 9876543210"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-register">{t('password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password-register"
                          name="password"
                          type="password"
                          placeholder="Create a password"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      variant="divine" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : t('create.account')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;