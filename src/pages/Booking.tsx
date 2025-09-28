import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Sparkles, Check, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import somnathTemple from "@/assets/somnath-temple.jpg";
import dwarkaTemple from "@/assets/dwarka-temple.jpg";
import badrinathTemple from "@/assets/badrinath-temple.jpg";
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
  badrinath: {
    name: "Badrinath Temple",
    location: "Uttarakhand, India", 
    image: badrinathTemple,
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

const Booking = () => {
  const navigate = useNavigate();
  const { templeId } = useParams();
  const [selectedService, setSelectedService] = useState<'darshan' | 'aarti'>('darshan');
  const [selectedDate, setSelectedDate] = useState(getNext3Days()[0].date);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const temple = temples[templeId as keyof typeof temples];
  const availableDays = getNext3Days();

  if (!temple) {
    return <div>Temple not found</div>;
  }

  const handleSlotSelect = (slotId: string) => {
    if (bookedSlots.includes(`${selectedDate}-${slotId}`)) return;
    setSelectedSlot(slotId);
  };

  const handleBooking = () => {
    if (!selectedSlot) {
      toast({
        title: "Please select a time slot",
        variant: "destructive",
      });
      return;
    }

    const bookingId = `${selectedDate}-${selectedSlot}`;
    setBookedSlots([...bookedSlots, bookingId]);
    
    toast({
      title: "Booking Confirmed! 🙏",
      description: `Your ${selectedService} is booked for ${timeSlots.find(s => s.id === selectedSlot)?.time}`,
    });

    setSelectedSlot(null);
  };

  const isSlotBooked = (slotId: string) => {
    return bookedSlots.includes(`${selectedDate}-${slotId}`);
  };

  const getSlotVariant = (slot: any) => {
    const bookingId = `${selectedDate}-${slot.id}`;
    if (isSlotBooked(slot.id)) return "default";
    if (slot.available === 0) return "outline";
    if (selectedSlot === slot.id) return "divine";
    return "temple";
  };

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
                      const isBooked = isSlotBooked(slot.id);
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
                          {isBooked && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
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
                    onClick={handleBooking}
                    disabled={!selectedSlot}
                    className="w-full"
                  >
                    {selectedSlot 
                      ? `Confirm ${selectedService} Booking` 
                      : `Select a time slot to book ${selectedService}`
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booked Slots Summary */}
        {bookedSlots.length > 0 && (
          <Card className="mt-8 shadow-ethereal border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                Your Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bookedSlots.map((booking) => {
                  const [date, slotId] = booking.split('-');
                  const slot = timeSlots.find(s => s.id === slotId);
                  const dayInfo = availableDays.find(d => d.date === date);
                  
                  return (
                    <div key={booking} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-green-800">{temple.name} - {selectedService}</p>
                        <p className="text-sm text-green-600">{dayInfo?.displayDate} • {slot?.time}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Confirmed
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Booking;