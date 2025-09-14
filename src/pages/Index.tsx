import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import HomePage from "@/components/HomePage";
import ChatInterface from "@/components/ChatInterface";
import DigitalTwinProfile from "@/components/DigitalTwinProfile";

type AppPage = "splash" | "home" | "chat" | "profile" | "insights" | "collaborations";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>("splash");

  const navigate = (page: string) => {
    setCurrentPage(page as AppPage);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "splash":
        return <SplashScreen onComplete={() => setCurrentPage("home")} />;
      case "home":
        return <HomePage onNavigate={navigate} />;
      case "chat":
        return <ChatInterface onBack={() => setCurrentPage("home")} />;
      case "profile":
        return <DigitalTwinProfile onBack={() => setCurrentPage("home")} />;
      case "insights":
        return <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold gradient-text">Insights Dashboard</h1>
            <p className="text-muted-foreground">Coming Soon - AI Analytics & Insights</p>
            <button 
              onClick={() => setCurrentPage("home")}
              className="text-primary underline"
            >
              Back to Home
            </button>
          </div>
        </div>;
      case "collaborations":
        return <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold gradient-text">Brand Collaborations</h1>
            <p className="text-muted-foreground">Coming Soon - Partnership Opportunities</p>
            <button 
              onClick={() => setCurrentPage("home")}
              className="text-primary underline"
            >
              Back to Home
            </button>
          </div>
        </div>;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {renderPage()}
    </div>
  );
};

export default Index;