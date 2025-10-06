import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
}

interface Booking {
  id: string;
  templeId: string;
  templeName: string;
  service: 'darshan' | 'aarti';
  date: string;
  timeSlot: string;
  qrCode: string;
  familyMembers: string[];
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface UserContextType {
  user: User | null;
  session: Session | null;
  bookings: Booking[];
  logout: () => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id' | 'qrCode' | 'createdAt'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);

        if (session?.user) {
          // Defer Supabase calls to avoid deadlocks inside the callback
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user!.id)
              .single();

            const { data: roles } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user!.id);

            const isAdmin = roles?.some(r => r.role === 'admin') || false;

            setUser({
              id: session.user!.id,
              name: profile?.name || session.user!.email?.split('@')[0] || 'User',
              email: session.user!.email || '',
              phone: profile?.phone,
              isAdmin
            });
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id);

          const isAdmin = roles?.some(r => r.role === 'admin') || false;

          setUser({
            id: session.user.id,
            name: profile?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            phone: profile?.phone,
            isAdmin
          });
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setBookings([]);
  };

  const generateQRCode = () => {
    return `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'qrCode' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `BK-${Date.now()}`,
      qrCode: generateQRCode(),
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    ));
  };

  return (
    <UserContext.Provider value={{
      user,
      session,
      bookings,
      logout,
      addBooking,
      updateBooking,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};