import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Homepage
    'sacred.journey': 'Sacred Journey',
    'plan.divine.visits': 'Plan your divine temple visits with blessed ease',
    'temples.count': '5 Sacred Temples',
    'easy.booking': 'Easy Time Booking',
    'divine.experience': 'Divine Experience',
    'start.journey': 'Start Your Journey',
    
    // Auth
    'join.divine.journey': 'Join the Divine Journey',
    'enter.details': 'Enter your details to access temple bookings',
    'login': 'Login',
    'register': 'Register',
    'full.name': 'Full Name',
    'email': 'Email',
    'phone': 'Phone Number',
    'password': 'Password',
    'sign.in': 'Sign In',
    'create.account': 'Create Account',
    'admin.login': 'Admin Login',
    
    // Profile
    'profile.settings': 'Profile & Settings',
    'my.bookings': 'My Bookings',
    'logout': 'Logout',
    'welcome.back': 'Welcome back!',
    
    // Temple Selection
    'choose.destination': 'Choose Your Sacred Destination',
    'select.temple': 'Select a temple to begin your spiritual journey and book your darshan',
    'book.darshan': 'Book Darshan',
    'blessed.journey': 'May your journey be blessed',
    
    // Booking
    'book.visit': 'Book Your Visit',
    'select.preference': 'Select Your Preference',
    'choose.service': 'Choose service type, date, and time slot',
    'darshan': 'Darshan',
    'aarti': 'Aarti',
    'select.date': 'Select Date',
    'available.slots': 'Available Time Slots',
    'confirm.booking': 'Confirm Booking',
    'your.bookings': 'Your Bookings',
    'confirmed': 'Confirmed',
    
    // Languages
    'english': 'English',
    'hindi': 'हिंदी',
    'gujarati': 'ગુજરાતી'
  },
  hi: {
    // Homepage
    'sacred.journey': 'पवित्र यात्रा',
    'plan.divine.visits': 'अपनी दिव्य मंदिर यात्राओं की योजना सरलता से बनाएं',
    'temples.count': '5 पवित्र मंदिर',
    'easy.booking': 'आसान समय बुकिंग',
    'divine.experience': 'दिव्य अनुभव',
    'start.journey': 'अपनी यात्रा शुरू करें',
    
    // Auth
    'join.divine.journey': 'दिव्य यात्रा में शामिल हों',
    'enter.details': 'मंदिर बुकिंग के लिए अपनी जानकारी दर्ज करें',
    'login': 'लॉगिन',
    'register': 'पंजीकरण',
    'full.name': 'पूरा नाम',
    'email': 'ईमेल',
    'phone': 'फोन नंबर',
    'password': 'पासवर्ड',
    'sign.in': 'साइन इन',
    'create.account': 'खाता बनाएं',
    'admin.login': 'एडमिन लॉगिन',
    
    // Profile
    'profile.settings': 'प्रोफ़ाइल और सेटिंग्स',
    'my.bookings': 'मेरी बुकिंग',
    'logout': 'लॉगआउट',
    'welcome.back': 'वापसी की खुशी!',
    
    // Temple Selection
    'choose.destination': 'अपना पवित्र गंतव्य चुनें',
    'select.temple': 'अपनी आध्यात्मिक यात्रा शुरू करने और दर्शन बुक करने के लिए एक मंदिर चुनें',
    'book.darshan': 'दर्शन बुक करें',
    'blessed.journey': 'आपकी यात्रा शुभ हो',
    
    // Booking
    'book.visit': 'अपनी यात्रा बुक करें',
    'select.preference': 'अपनी पसंद चुनें',
    'choose.service': 'सेवा प्रकार, दिनांक और समय स्लॉट चुनें',
    'darshan': 'दर्शन',
    'aarti': 'आरती',
    'select.date': 'दिनांक चुनें',
    'available.slots': 'उपलब्ध समय स्लॉट',
    'confirm.booking': 'बुकिंग की पुष्टि करें',
    'your.bookings': 'आपकी बुकिंग',
    'confirmed': 'पुष्टि की गई',
    
    // Languages
    'english': 'English',
    'hindi': 'हिंदी',
    'gujarati': 'ગુજરાતી'
  },
  gu: {
    // Homepage
    'sacred.journey': 'પવિત્ર યાત્રા',
    'plan.divine.visits': 'તમારી દિવ્ય મંદિર મુલાકાતોની યોજના સરળતાથી બનાવો',
    'temples.count': '5 પવિત્ર મંદિરો',
    'easy.booking': 'સરળ સમય બુકિંગ',
    'divine.experience': 'દિવ્ય અનુભવ',
    'start.journey': 'તમારી યાત્રા શરૂ કરો',
    
    // Auth
    'join.divine.journey': 'દિવ્ય યાત્રામાં જોડાઓ',
    'enter.details': 'મંદિર બુકિંગ માટે તમારી વિગતો દાખલ કરો',
    'login': 'લૉગિન',
    'register': 'નોંધણી',
    'full.name': 'સંપૂર્ણ નામ',
    'email': 'ઇમેઇલ',
    'phone': 'ફોન નંબર',
    'password': 'પાસવર્ડ',
    'sign.in': 'સાઇન ઇન',
    'create.account': 'ખાતું બનાવો',
    'admin.login': 'એડમિન લૉગિન',
    
    // Profile
    'profile.settings': 'પ્રોફાઇલ અને સેટિંગ્સ',
    'my.bookings': 'મારી બુકિંગ',
    'logout': 'લૉગઆઉટ',
    'welcome.back': 'પાછા ફરવાની ખુશી!',
    
    // Temple Selection
    'choose.destination': 'તમારું પવિત્ર ગંતવ્ય પસંદ કરો',
    'select.temple': 'તમારી આધ્યાત્મિક યાત્રા શરૂ કરવા અને દર્શન બુક કરવા માટે મંદિર પસંદ કરો',
    'book.darshan': 'દર્શન બુક કરો',
    'blessed.journey': 'તમારી યાત્રા શુભ હો',
    
    // Booking
    'book.visit': 'તમારી મુલાકાત બુક કરો',
    'select.preference': 'તમારી પસંદગી પસંદ કરો',
    'choose.service': 'સેવા પ્રકાર, તારીખ અને સમય સ્લોટ પસંદ કરો',
    'darshan': 'દર્શન',
    'aarti': 'આરતી',
    'select.date': 'તારીખ પસંદ કરો',
    'available.slots': 'ઉપલબ્ધ સમય સ્લોટ',
    'confirm.booking': 'બુકિંગની પુષ્ટિ કરો',
    'your.bookings': 'તમારી બુકિંગ',
    'confirmed': 'પુષ્ટિ કરેલ',
    
    // Languages
    'english': 'English',
    'hindi': 'हिंदी', 
    'gujarati': 'ગુજરાતી'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};