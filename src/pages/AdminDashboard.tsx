import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Camera,
  MapPin,
  Clock,
  Sparkles,
  Activity
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedTemple, setSelectedTemple] = useState('somnath');

  if (!user || !user.isAdmin) {
    navigate('/auth');
    return null;
  }

  const temples = [
    { id: 'somnath', name: 'Somnath Temple', currentCount: 245, capacity: 500, status: 'normal' },
    { id: 'dwarka', name: 'Dwarka Temple', currentCount: 387, capacity: 400, status: 'high' },
    { id: 'badrinath', name: 'Badrinath Temple', currentCount: 156, capacity: 300, status: 'normal' },
    { id: 'ambaji', name: 'Ambaji Temple', currentCount: 289, capacity: 350, status: 'medium' },
    { id: 'pavagadh', name: 'Pavagadh Temple', currentCount: 98, capacity: 250, status: 'low' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const todayStats = {
    totalEntries: 1247,
    totalExits: 1089,
    currentDevotees: 1175,
    peakTime: "10:00 AM - 12:00 PM"
  };

  const securityAlerts = [
    { id: 1, temple: 'Dwarka Temple', message: 'High crowd density detected', time: '10:30 AM', severity: 'high' },
    { id: 2, temple: 'Ambaji Temple', message: 'Queue management required', time: '11:15 AM', severity: 'medium' },
    { id: 3, temple: 'Somnath Temple', message: 'Emergency exit check completed', time: '09:45 AM', severity: 'low' }
  ];

  return (
    <div className="min-h-screen bg-gradient-spiritual">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/auth')}
              className="text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-divine bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            System Online
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-ethereal border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Entries</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{todayStats.totalEntries}</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="shadow-ethereal border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Exits</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{todayStats.totalExits}</div>
              <p className="text-xs text-muted-foreground">+8% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="shadow-ethereal border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Devotees</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{todayStats.currentDevotees}</div>
              <p className="text-xs text-muted-foreground">Across all temples</p>
            </CardContent>
          </Card>

          <Card className="shadow-ethereal border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Time</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">10-12 AM</div>
              <p className="text-xs text-muted-foreground">Highest traffic period</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Temple Status Panel */}
          <div className="lg:col-span-2">
            <Card className="shadow-ethereal border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Temple Status Overview
                </CardTitle>
                <CardDescription>Real-time crowd monitoring across all temples</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {temples.map((temple) => (
                  <div 
                    key={temple.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedTemple === temple.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTemple(temple.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <h4 className="font-semibold">{temple.name}</h4>
                      </div>
                      <Badge className={getStatusColor(temple.status)}>
                        {temple.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>Occupancy</span>
                      <span>{temple.currentCount}/{temple.capacity} ({getOccupancyPercentage(temple.currentCount, temple.capacity)}%)</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          getOccupancyPercentage(temple.currentCount, temple.capacity) > 80 
                            ? 'bg-red-500' 
                            : getOccupancyPercentage(temple.currentCount, temple.capacity) > 60 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${getOccupancyPercentage(temple.currentCount, temple.capacity)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Live Feed */}
            <Card className="shadow-ethereal border-primary/20 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Live CCTV Feed - {temples.find(t => t.id === selectedTemple)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold mb-2">Live Feed</p>
                    <p className="text-sm opacity-75">Camera feed would be embedded here</p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-xs">LIVE</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Security Alerts */}
            <Card className="shadow-ethereal border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {securityAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'high' 
                        ? 'border-red-500 bg-red-50' 
                        : alert.severity === 'medium'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-green-500 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.temple}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Controls */}
            <Card className="shadow-ethereal border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Emergency Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="destructive" className="w-full">
                  Emergency Alert
                </Button>
                <Button variant="outline" className="w-full">
                  Crowd Control
                </Button>
                <Button variant="outline" className="w-full">
                  Security Dispatch
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-ethereal border-primary/20">
              <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Average Visit Duration</span>
                  <span className="font-medium">45 mins</span>
                </div>
                <div className="flex justify-between">
                  <span>Peak Occupancy Today</span>
                  <span className="font-medium">89%</span>
                </div>
                <div className="flex justify-between">
                  <span>Total QR Scans</span>
                  <span className="font-medium">2,336</span>
                </div>
                <div className="flex justify-between">
                  <span>System Uptime</span>
                  <span className="font-medium text-green-600">99.9%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;