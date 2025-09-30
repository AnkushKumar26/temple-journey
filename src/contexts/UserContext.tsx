import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
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
  bookings: Booking[];
  login: (userData: User) => void;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id' | 'qrCode' | 'createdAt'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
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
      bookings,
      login,
      logout,
      addBooking,
      updateBooking,
      isAuthenticated: !!user
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