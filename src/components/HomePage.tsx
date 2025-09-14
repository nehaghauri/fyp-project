import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, 
  BarChart3, 
  Users, 
  Sparkles,
  Mic,
  Brain,
  Zap,
  Settings
} from "lucide-react";
import avatarImage from "@/assets/digital-twin-avatar.png";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage = ({ onNavigate }: HomePageProps) => {
  const [greeting] = useState("Good morning");

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Start Chat",
      description: "Converse with your AI twin",
      color: "primary",
      action: () => onNavigate("chat")
    },
    {
      icon: BarChart3,
      title: "Insights",
      description: "View your AI analytics",
      color: "secondary",
      action: () => onNavigate("insights")
    },
    {
      icon: Users,
      title: "Collaborations",
      description: "Explore brand partnerships",
      color: "accent",
      action: () => onNavigate("collaborations")
    },
    {
      icon: Settings,
      title: "Twin Profile",
      description: "Customize your digital self",
      color: "muted",
      action: () => onNavigate("profile")
    }
  ];

  const insights = [
    {
      title: "Conversation Streak",
      value: "7 days",
      trend: "+2 from last week"
    },
    {
      title: "Twin Accuracy",
      value: "94%",
      trend: "+3% improvement"
    },
    {
      title: "Brand Matches",
      value: "12",
      trend: "3 new opportunities"
    }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {greeting}, Alex
          </h1>
          <p className="text-muted-foreground">
            Your digital twin is ready to assist you
          </p>
        </div>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Digital Twin Avatar Section */}
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img 
                src={avatarImage} 
                alt="Your Digital Twin"
                className="w-24 h-24 rounded-full object-cover glow-effect"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-accent-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Your Digital Twin</h3>
              <p className="text-muted-foreground mb-4">
                I've learned your preferences and communication style. Ready to represent you intelligently.
              </p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="bg-gradient-primary"
                  onClick={() => onNavigate("chat")}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat Now
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onNavigate("profile")}
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Customize
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="glass-card cursor-pointer hover:shadow-glow transition-all duration-300 group"
              onClick={action.action}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center group-hover:animate-scale-in">
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Insights Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <Card key={index} className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {insight.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{insight.value}</div>
                <div className="text-xs text-accent font-medium flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {insight.trend}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Voice Assistant Quick Access */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="lg" 
          className="rounded-full w-16 h-16 bg-gradient-primary shadow-glow hover:shadow-lg transition-all duration-300"
          onClick={() => onNavigate("chat")}
        >
          <Mic className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default HomePage;