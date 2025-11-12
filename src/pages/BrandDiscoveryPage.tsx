import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Search, 
  Store,
  Users,
  Star,
  Check,
  Filter
} from "lucide-react";

interface Brand {
  id: number;
  name: string;
  logo: string;
  category: string;
  description: string;
  rating: number;
  totalUsers: number;
  isConnected: boolean;
  tags: string[];
}

const BrandDiscoveryPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "E-commerce", "Healthcare", "Finance", "Entertainment", "Technology", "Food & Dining"];

  const brands: Brand[] = [
    {
      id: 1,
      name: "TechCorp",
      logo: "🏢",
      category: "Technology",
      description: "Leading technology solutions provider with AI-powered customer support",
      rating: 4.8,
      totalUsers: 15420,
      isConnected: true,
      tags: ["AI Support", "24/7", "Premium"]
    },
    {
      id: 2,
      name: "FashionHub",
      logo: "👗",
      category: "E-commerce",
      description: "Your one-stop destination for latest fashion trends and style advice",
      rating: 4.6,
      totalUsers: 8930,
      isConnected: true,
      tags: ["Fashion", "Shopping", "Style Tips"]
    },
    {
      id: 3,
      name: "HealthPlus",
      logo: "🏥",
      category: "Healthcare",
      description: "Comprehensive healthcare services with appointment scheduling and health tracking",
      rating: 4.9,
      totalUsers: 12340,
      isConnected: true,
      tags: ["Health", "Appointments", "Medical"]
    },
    {
      id: 4,
      name: "GourmetDelight",
      logo: "🍽️",
      category: "Food & Dining",
      description: "Discover the best restaurants and order your favorite meals",
      rating: 4.7,
      totalUsers: 9870,
      isConnected: false,
      tags: ["Food Delivery", "Restaurants", "Reviews"]
    },
    {
      id: 5,
      name: "StreamFlix",
      logo: "🎬",
      category: "Entertainment",
      description: "Unlimited movies and TV shows with personalized recommendations",
      rating: 4.8,
      totalUsers: 25600,
      isConnected: false,
      tags: ["Streaming", "Movies", "TV Shows"]
    },
    {
      id: 6,
      name: "BankSecure",
      logo: "🏦",
      category: "Finance",
      description: "Modern banking solutions with AI-powered financial advice",
      rating: 4.5,
      totalUsers: 18900,
      isConnected: false,
      tags: ["Banking", "Finance", "Secure"]
    },
    {
      id: 7,
      name: "FitLife",
      logo: "💪",
      category: "Healthcare",
      description: "Personal fitness coaching and nutrition planning",
      rating: 4.7,
      totalUsers: 7650,
      isConnected: false,
      tags: ["Fitness", "Nutrition", "Coaching"]
    },
    {
      id: 8,
      name: "SmartHome",
      logo: "🏠",
      category: "Technology",
      description: "Control and automate your home with intelligent devices",
      rating: 4.6,
      totalUsers: 5430,
      isConnected: false,
      tags: ["Smart Home", "IoT", "Automation"]
    },
    {
      id: 9,
      name: "BookWorm",
      logo: "📚",
      category: "Entertainment",
      description: "Digital library with millions of books and audiobooks",
      rating: 4.8,
      totalUsers: 11200,
      isConnected: false,
      tags: ["Books", "Reading", "Audiobooks"]
    },
    {
      id: 10,
      name: "TravelEase",
      logo: "✈️",
      category: "E-commerce",
      description: "Plan your perfect vacation with AI-powered travel recommendations",
      rating: 4.7,
      totalUsers: 14560,
      isConnected: false,
      tags: ["Travel", "Hotels", "Flights"]
    }
  ];

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (brandId: number) => {
    console.log(`Connecting to brand ${brandId}`);
    // In real app, call API to connect
    alert("Connection request sent! You'll be notified when approved.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Discover Brands</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Connect your digital twin to your favorite brands
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {brands.filter(b => b.isConnected).length} Connected
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              {brands.length} Total Brands
            </Badge>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredBrands.length} {filteredBrands.length === 1 ? 'brand' : 'brands'}
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Card 
              key={brand.id} 
              className="glass-card hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{brand.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{brand.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {brand.category}
                      </Badge>
                    </div>
                  </div>
                  {brand.isConnected && (
                    <Badge className="bg-green-500 text-white">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm">
                  {brand.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{brand.rating}</span>
                    <span className="text-muted-foreground">rating</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{brand.totalUsers.toLocaleString()} users</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {brand.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                {brand.isConnected ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/brand/${brand.id}`)}
                  >
                    View Details
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-primary"
                    onClick={() => handleConnect(brand.id)}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredBrands.length === 0 && (
          <div className="text-center py-16">
            <Store className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No brands found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandDiscoveryPage;