import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, QrCode, Users, MapPin, Sparkles } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, bookings } = useUser();
  const { t } = useLanguage();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.date) >= new Date() && booking.status === 'confirmed'
  );

  const pastBookings = bookings.filter(booking => 
    new Date(booking.date) < new Date() || booking.status !== 'confirmed'
  );

  return (
    <div className="min-h-screen bg-gradient-spiritual relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
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
            <h1 className="text-2xl font-bold text-foreground">{t('my.bookings')}</h1>
          </div>
        </div>

        {bookings.length === 0 ? (
          <Card className="shadow-ethereal border-primary/20 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't made any temple bookings yet. Start your spiritual journey today!
              </p>
              <Button variant="divine" onClick={() => navigate('/temples')}>
                Book Your First Visit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Visits
                </h2>
                <div className="grid gap-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id} className="shadow-ethereal border-primary/20 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {booking.templeName}
                              <Sparkles className="w-4 h-4 text-primary" />
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {booking.service === 'darshan' ? 'Darshan' : 'Aarti'}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{booking.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{booking.familyMembers.length + 1} members</span>
                          </div>
                        </div>

                        {booking.familyMembers.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Family Members:</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.familyMembers.join(', ')}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <QrCode className="w-4 h-4" />
                            <span>QR Code: {booking.qrCode}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            View QR Code
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Past Visits
                </h2>
                <div className="grid gap-4">
                  {pastBookings.map((booking) => (
                    <Card key={booking.id} className="shadow-ethereal border-primary/20 backdrop-blur-sm opacity-75">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-muted-foreground">
                              {booking.templeName}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {booking.service === 'darshan' ? 'Darshan' : 'Aarti'}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{booking.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{booking.familyMembers.length + 1} members</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;