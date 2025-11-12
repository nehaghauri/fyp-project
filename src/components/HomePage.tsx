import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Sparkles,
  Mic,
  Brain,
  Zap,
  Settings,
  LogOut,
  Store,
  History,
  ThumbsUp,
  Shield,
  TrendingUp,
  Plus
} from "lucide-react";
import avatarImage from "@/assets/digital-twin-avatar.png";
import NotificationCenter from "@/components/NotificationCenter";
import TwinTrainingProgress from "@/components/TwinTrainingProgress";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [greeting] = useState("Good morning");
  const [twinName, setTwinName] = useState(user?.twinName || 'Your Digital Twin');
  const [twinBio, setTwinBio] = useState('A helpful AI assistant that represents me');

  // Load twin profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('digitalTwinProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.name) {
          setTwinName(profile.name);
        }
        if (profile.bio) {
          setTwinBio(profile.bio);
        }
      } catch (error) {
        console.error('Failed to load twin profile:', error);
      }
    }
  }, []);

  // Mock data - replace with real data later
  const connectedBrands = [
    { id: 1, name: "TechCorp", logo: "🏢", status: "active", interactions: 12 },
    { id: 2, name: "FashionHub", logo: "👗", status: "active", interactions: 5 },
    { id: 3, name: "HealthPlus", logo: "🏥", status: "active", interactions: 8 }
  ];

  const recentConversations = [
    { brand: "TechCorp", message: "Product inquiry resolved", time: "2 hours ago", sentiment: "positive" },
    { brand: "FashionHub", message: "Order status updated", time: "5 hours ago", sentiment: "positive" },
    { brand: "HealthPlus", message: "Appointment scheduled", time: "1 day ago", sentiment: "neutral" }
  ];

  const recommendations = [
    { brand: "TechCorp", product: "Premium Support Package", reason: "Based on your recent inquiries" },
    { brand: "FashionHub", product: "Summer Collection", reason: "Matches your style preferences" }
  ];

  const activityStats = [
    { label: "Interactions This Week", value: "18", icon: MessageCircle },
    { label: "Satisfaction Score", value: "96%", icon: ThumbsUp },
    { label: "Active Brands", value: "3", icon: Store }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {greeting}, {user?.name || 'User'}
          </h1>
          <p className="text-muted-foreground">
            Your digital twin is working for you
          </p>
        </div>
        <div className="flex gap-2">
          <NotificationCenter />
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate("/profile")}
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Digital Twin Card */}
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img 
                src={avatarImage} 
                alt="Your Digital Twin"
                className="w-24 h-24 rounded-full object-cover glow-effect"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                {twinName}
              </h3>
              <p className="text-muted-foreground mb-4">
                Active and learning • Handling {connectedBrands.length} brand connections
              </p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="bg-gradient-primary"
                  onClick={() => navigate("/chat")}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat with Twin
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate("/profile")}
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Customize Personality
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activityStats.map((stat, index) => (
          <Card key={index} className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ADD THIS: View Analytics Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => navigate("/analytics")}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          View Detailed Analytics
        </Button>
      </div>

      <TwinTrainingProgress />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Connected Brands & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Connected Brands */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Connected Brands
                </CardTitle>
                  <Button size="sm" variant="outline" onClick={() => navigate("/brands")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect New
                  </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {connectedBrands.map((brand) => (
                  <div 
                    key={brand.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
                    onClick={() => navigate(`/brand/${brand.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{brand.logo}</div>
                      <div>
                        <h4 className="font-semibold">{brand.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {brand.interactions} interactions
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      {brand.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{rec.product}</h4>
                        <p className="text-sm text-muted-foreground">from {rec.brand}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {rec.reason}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((conv, index) => (
                  <div key={index} className="pb-4 border-b border-border last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{conv.brand}</h4>
                      <Badge 
                        variant="outline" 
                        className={
                          conv.sentiment === 'positive' 
                            ? 'bg-green-500/10 text-green-600 border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                        }
                      >
                        {conv.sentiment}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{conv.message}</p>
                    <p className="text-xs text-muted-foreground">{conv.time}</p>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate("/history")}
              >
                View All Conversations
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Card */}
          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                Privacy & Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Your data is secure and you control what brands can access.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate("/privacy")}
              >
                Manage Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="lg" 
          className="rounded-full w-16 h-16 bg-gradient-primary shadow-glow hover:shadow-lg transition-all duration-300"
          onClick={() => navigate("/chat")}
        >
          <Mic className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default HomePage;