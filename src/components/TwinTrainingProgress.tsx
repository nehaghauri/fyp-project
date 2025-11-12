import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Brain,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const TwinTrainingProgress = () => {
  const navigate = useNavigate();  // ADD THIS LINE
  const [trainingData] = useState({
    overallProgress: 78,
    conversationsAnalyzed: 47,
    conversationsTarget: 100,
    preferencesLearned: 23,
    accuracyRate: 94,
    status: "Learning" as "Well Trained" | "Learning" | "Needs Training",
    recentImprovements: [
      "Learned your communication style",
      "Identified 5 new preferences",
      "Improved response accuracy by 3%"
    ],
    suggestions: [
      "Have 10 more conversations to improve accuracy",
      "Update your personality settings",
      "Connect to 2 more brands for better learning"
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Well Trained":
        return "bg-green-500";
      case "Learning":
        return "bg-blue-500";
      case "Needs Training":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Well Trained":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "Learning":
        return <Brain className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "Needs Training":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <CardTitle>Twin Training Progress</CardTitle>
          </div>
          <Badge className={`${getStatusColor(trainingData.status)} text-white`}>
            {trainingData.status}
          </Badge>
        </div>
        <CardDescription>
          Track how well your digital twin knows you
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Training</span>
            <span className="text-muted-foreground">{trainingData.overallProgress}%</span>
          </div>
          <Progress value={trainingData.overallProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {100 - trainingData.overallProgress}% more to reach expert level
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Conversations</span>
            </div>
            <p className="text-2xl font-bold">{trainingData.conversationsAnalyzed}</p>
            <p className="text-xs text-muted-foreground">
              / {trainingData.conversationsTarget}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Preferences</span>
            </div>
            <p className="text-2xl font-bold">{trainingData.preferencesLearned}</p>
            <p className="text-xs text-muted-foreground">learned</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Accuracy</span>
            </div>
            <p className="text-2xl font-bold">{trainingData.accuracyRate}%</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +3% this week
            </p>
          </div>
        </div>

        {/* Recent Improvements */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <h4 className="text-sm font-semibold">Recent Improvements</h4>
          </div>
          <div className="space-y-2">
            {trainingData.recentImprovements.map((improvement, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{improvement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Training Suggestions */}
        <div className="space-y-3 pt-3 border-t">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            Suggestions to Improve
          </h4>
          <div className="space-y-2">
            {trainingData.suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 text-sm p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/30 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              size="sm"
              onClick={() => navigate("/training")}
            >
              View Details
            </Button>
            <Button 
              className="flex-1 bg-gradient-primary" 
              size="sm"
              onClick={() => navigate("/chat")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Train Now
            </Button>
          </div>
      </CardContent>
    </Card>
  );
};

export default TwinTrainingProgress;