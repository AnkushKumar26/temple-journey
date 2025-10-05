import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Sparkles } from "lucide-react";
import somnathTemple from "@/assets/somnath-temple.jpg";
import dwarkaTemple from "@/assets/dwarka-temple.jpg";
import ambajiTemple from "@/assets/ambaji-temple.jpg";
import pavagardhTemple from "@/assets/pavagadh-temple.jpg";

const temples = [
  {
    id: "somnath",
    name: "Somnath Temple",
    location: "Gujarat, India",
    description: "One of the twelve Jyotirlinga shrines of Lord Shiva, known for its magnificent coastal location and ancient heritage.",
    image: somnathTemple,
    rating: 4.8,
    features: ["Jyotirlinga", "Coastal View", "Ancient Heritage"]
  },
  {
    id: "dwarka",
    name: "Dwarka Temple",
    location: "Gujarat, India", 
    description: "Sacred abode of Lord Krishna, one of the Char Dham pilgrimage sites with stunning architecture and spiritual significance.",
    image: dwarkaTemple,
    rating: 4.9,
    features: ["Char Dham", "Krishna Temple", "Divine Architecture"]
  },
  {
    id: "ambaji",
    name: "Ambaji Temple",
    location: "Gujarat, India",
    description: "Sacred Shakti Peeth dedicated to Goddess Amba, known for its spiritual power and ancient traditions.",
    image: ambajiTemple,
    rating: 4.8,
    features: ["Shakti Peeth", "Goddess Temple", "Ancient Heritage"]
  },
  {
    id: "pavagadh",
    name: "Pavagadh Temple",
    location: "Gujarat, India",
    description: "Historic hilltop temple complex with stunning views and deep spiritual significance.",
    image: pavagardhTemple,
    rating: 4.6,
    features: ["Hilltop Temple", "Historic Site", "Scenic Views"]
  }
];

const TempleSelection = () => {
  const navigate = useNavigate();

  const handleTempleSelect = (templeId: string) => {
    navigate(`/booking/${templeId}`);
  };

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
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-divine bg-clip-text text-transparent">
                Choose Your Sacred Destination
              </h1>
            </div>
          </div>
        </div>

        <p className="text-center text-muted-foreground mb-12 text-lg">
          Select a temple to begin your spiritual journey and book your darshan
        </p>

        {/* Temples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {temples.map((temple) => (
            <Card 
              key={temple.id}
              className="group hover:shadow-divine transition-all duration-300 hover:scale-105 border-primary/10 overflow-hidden"
            >
              {/* Temple Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={temple.image} 
                  alt={temple.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-xs font-medium">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {temple.rating}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  {temple.name}
                  <Sparkles className="w-4 h-4 text-primary" />
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {temple.location}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {temple.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {temple.features.map((feature) => (
                    <Badge 
                      key={feature}
                      variant="outline" 
                      className="text-xs border-primary/30 text-primary"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                <Button 
                  variant="divine"
                  className="w-full mt-4"
                  onClick={() => handleTempleSelect(temple.id)}
                >
                  Book Darshan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary" />
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm">May your journey be blessed</span>
            <Sparkles className="w-4 h-4 text-primary" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleSelection;