import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'hi', name: t('hindi'), flag: '🇮🇳' },
    { code: 'gu', name: t('gujarati'), flag: '🇮🇳' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-white/10 border border-white/20"
        >
          <Languages className="w-4 h-4 mr-2" />
          {languages.find(l => l.code === language)?.flag}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className="flex items-center gap-2"
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};