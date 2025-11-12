import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import ActivityDashboard from "@/components/ActivityDashboard";

const ActivityAnalyticsPage = () => {
  const navigate = useNavigate();

  const handleExport = () => {
    console.log("Exporting analytics...");
    alert("Export feature coming soon!");
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
              <h1 className="text-3xl font-bold gradient-text">Activity Analytics</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Visualize your digital twin's performance and interactions
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Activity Dashboard */}
        <ActivityDashboard />
      </div>
    </div>
  );
};

export default ActivityAnalyticsPage;