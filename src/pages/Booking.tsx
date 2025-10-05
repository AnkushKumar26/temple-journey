import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Sparkles, Check, Users, Plus, Minus, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import somnathTemple from "@/assets/somnath-temple.jpg";
import dwarkaTemple from "@/assets/dwarka-temple.jpg";
import ambajiTemple from "@/assets/ambaji-temple.jpg";
import pavagardhTemple from "@/assets/pavagadh-temple.jpg";

const temples = {
  somnath: {
    name: "Somnath Temple",
    location: "Gujarat, India",
    image: somnathTemple,
  },
  dwarka: {
    name: "Dwarka Temple", 
    location: "Gujarat, India",
    image: dwarkaTemple,
  },
  ambaji: {
    name: "Ambaji Temple",
    location: "Gujarat, India",
    image: ambajiTemple,
  },
  pavagadh: {
    name: "Pavagadh Temple",
    location: "Gujarat, India",
    image: pavagardhTemple,
  }
};

const timeSlots = [
  { id: "6-8", time: "6:00 AM - 8:00 AM", available: 45, total: 50 },
  { id: "8-10", time: "8:00 AM - 10:00 AM", available: 23, total: 50 },
  { id: "10-12", time: "10:00 AM - 12:00 PM", available: 38, total: 50 },
  { id: "12-2", time: "12:00 PM - 2:00 PM", available: 12, total: 50 },
  { id: "2-4", time: "2:00 PM - 4:00 PM", available: 41, total: 50 },
  { id: "4-6", time: "4:00 PM - 6:00 PM", available: 29, total: 50 },
  { id: "6-8-pm", time: "6:00 PM - 8:00 PM", available: 7, total: 50 },
  { id: "8-10-pm", time: "8:00 PM - 10:00 PM", available: 0, total: 50 },
];

const getNext3Days = () => {
  const days = [];
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      date: date.toISOString().split('T')[0],
      displayDate: date.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      isToday: i === 0
    });
  }
  return days;
};

interface FamilyMember {
  name: string;
  age: string;
}

const Booking = () => {
  const navigate = useNavigate();
  const { templeId } = useParams();
  const { user } = useUser();
  const [selectedService, setSelectedService] = useState<'darshan' | 'aarti'>('darshan');
  const [selectedDate, setSelectedDate] = useState(getNext3Days()[0].date);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [numberOfDevotees, setNumberOfDevotees] = useState(1);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([{ name: '', age: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const temple = temples[templeId as keyof typeof temples];
  const availableDays = getNext3Days();

  if (!temple) {
    return <div>Temple not found</div>;
  }

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handleProceedToFamily = () => {
    if (!selectedSlot) {
      toast({
        title: "Please select a time slot",
        variant: "destructive",
      });
      return;
    }
    setShowFamilyForm(true);
  };

  const handleNumberChange = (delta: number) => {
    const newNumber = Math.max(1, numberOfDevotees + delta);
    setNumberOfDevotees(newNumber);
    
    const newMembers = [...familyMembers];
    if (delta > 0) {
      newMembers.push({ name: '', age: '' });
    } else if (newMembers.length > 1) {
      newMembers.pop();
    }
    setFamilyMembers(newMembers);
  };

  const updateFamilyMember = (index: number, field: 'name' | 'age', value: string) => {
    const newMembers = [...familyMembers];
    newMembers[index][field] = value;
    setFamilyMembers(newMembers);
  };

  const generateQRCode = () => {
    return `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleFinalBooking = async () => {
    if (!user) {
      toast({
        title: "Please login to book",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    // Validate family members
    const hasEmptyFields = familyMembers.some(member => !member.name || !member.age);
    if (hasEmptyFields) {
      toast({
        title: "Please fill all family member details",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const qrCodeValue = generateQRCode();
      const slot = timeSlots.find(s => s.id === selectedSlot);

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          temple_id: templeId,
          temple_name: temple.name,
          service: selectedService,
          booking_date: selectedDate,
          time_slot: slot?.time || '',
          number_of_devotees: numberOfDevotees,
          qr_code: qrCodeValue,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create family members
      const familyMembersData = familyMembers.map(member => ({
        booking_id: booking.id,
        name: member.name,
        age: parseInt(member.age),
      }));

      const { error: membersError } = await supabase
        .from('family_members')
        .insert(familyMembersData);

      if (membersError) throw membersError;

      setQrCode(qrCodeValue);
      toast({
        title: "Booking Confirmed! 🙏",
        description: `Your ${selectedService} is booked for ${slot?.time}`,
      });
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSlotVariant = (slot: any) => {
    if (slot.available === 0) return "outline";
    if (selectedSlot === slot.id) return "divine";
    return "temple";
  };

  // Show QR ticket if booking is complete
  if (qrCode) {
    return (
      <div className="min-h-screen bg-gradient-spiritual">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto shadow-ethereal border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
              <CardDescription>Your spiritual journey is confirmed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-6 rounded-lg border-2 border-primary/20">
                <div className="flex items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-mono text-sm text-muted-foreground">{qrCode}</p>
                  <p className="text-sm text-muted-foreground">Show this QR code at the temple entrance</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temple:</span>
                  <span className="font-medium">{temple.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium capitalize">{selectedService}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{new Date(selectedDate).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{timeSlots.find(s => s.id === selectedSlot)?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Devotees:</span>
                  <span className="font-medium">{numberOfDevotees}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Family Members:</h4>
                <div className="space-y-2">
                  {familyMembers.map((member, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{member.name}</span>
                      <span className="text-muted-foreground">{member.age} years</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="divine" 
                className="w-full"
                onClick={() => navigate('/my-bookings')}
              >
                View My Bookings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show family member form if slot is selected
  if (showFamilyForm) {
    return (
      <div className="min-h-screen bg-gradient-spiritual">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowFamilyForm(false)}
              className="text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-divine bg-clip-text text-transparent">
                Family Details
              </h1>
            </div>
          </div>

          <Card className="max-w-2xl mx-auto shadow-ethereal border-primary/20">
            <CardHeader>
              <CardTitle>Add Devotee Details</CardTitle>
              <CardDescription>Enter details for all family members traveling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <span className="font-medium">Number of Devotees</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleNumberChange(-1)}
                    disabled={numberOfDevotees <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-bold w-8 text-center">{numberOfDevotees}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleNumberChange(1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {familyMembers.map((member, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-semibold text-sm">Devotee {index + 1}</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${index}`}>Name</Label>
                        <Input
                          id={`name-${index}`}
                          value={member.name}
                          onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`age-${index}`}>Age</Label>
                        <Input
                          id={`age-${index}`}
                          type="number"
                          value={member.age}
                          onChange={(e) => updateFamilyMember(index, 'age', e.target.value)}
                          placeholder="Enter age"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                variant="divine" 
                size="lg"
                className="w-full"
                onClick={handleFinalBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Generate QR Ticket"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-spiritual">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/temples')}
            className="text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-divine bg-clip-text text-transparent">
              Book Your Visit
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Temple Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-ethereal border-primary/20">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={temple.image} 
                  alt={temple.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {temple.name}
                  <Sparkles className="w-4 h-4 text-primary" />
                </CardTitle>
                <CardDescription>{temple.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>2-hour slots available</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Next 3 days booking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Limited capacity per slot</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Interface */}
          <div className="lg:col-span-2">
            <Card className="shadow-ethereal border-primary/20">
              <CardHeader>
                <CardTitle>Select Your Preference</CardTitle>
                <CardDescription>Choose service type, date, and time slot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Selection */}
                <Tabs value={selectedService} onValueChange={(value: any) => setSelectedService(value)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="darshan">Darshan</TabsTrigger>
                    <TabsTrigger value="aarti">Aarti</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Date Selection */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Select Date
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {availableDays.map((day) => (
                      <Button
                        key={day.date}
                        variant={selectedDate === day.date ? "divine" : "temple"}
                        onClick={() => setSelectedDate(day.date)}
                        className="flex flex-col p-4 h-auto"
                      >
                        <span className="text-sm">{day.displayDate}</span>
                        {day.isToday && (
                          <Badge variant="secondary" className="mt-1 text-xs">Today</Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Available Time Slots
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {timeSlots.map((slot) => {
                      const isUnavailable = slot.available === 0;
                      
                      return (
                        <Button
                          key={slot.id}
                          variant={getSlotVariant(slot)}
                          onClick={() => handleSlotSelect(slot.id)}
                          disabled={isUnavailable}
                          className="flex justify-between p-4 h-auto relative"
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{slot.time}</span>
                            <span className="text-xs opacity-80">
                              {isUnavailable ? "Full" : `${slot.available}/${slot.total} available`}
                            </span>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Booking Button */}
                <div className="pt-4 border-t">
                  <Button 
                    variant="divine" 
                    size="lg"
                    onClick={handleProceedToFamily}
                    disabled={!selectedSlot}
                    className="w-full"
                  >
                    {selectedSlot 
                      ? "Proceed to Add Family Members" 
                      : `Select a time slot to continue`
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Booking;