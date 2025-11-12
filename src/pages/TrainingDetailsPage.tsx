import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Brain,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  CheckCircle2,
  Target,
  Calendar,
  BarChart3
} from "lucide-react";

const TrainingDetailsPage = () => {
  const navigate = useNavigate();

  const trainingMetrics = {
    overallProgress: 78,
    conversationsAnalyzed: 47,
    conversationsTarget: 100,
    preferencesLearned: 23,
    accuracyRate: 94,
    status: "Learning",
    startDate: "Jan 15, 2025",
    lastTraining: "2 hours ago"
  };

  const trainingHistory = [
    { date: "Nov 12, 2025", conversations: 5, preferencesLearned: 3, accuracyImprovement: 2 },
    { date: "Nov 11, 2025", conversations: 8, preferencesLearned: 4, accuracyImprovement: 1 },
    { date: "Nov 10, 2025", conversations: 6, preferencesLearned: 2, accuracyImprovement: 3 },
    { date: "Nov 9, 2025", conversations: 7, preferencesLearned: 5, accuracyImprovement: 2 },
    { date: "Nov 8, 2025", conversations: 4, preferencesLearned: 3, accuracyImprovement: 1 }
  ];

  const skillsLearned = [
    { skill: "Communication Style", level: 95, description: "Understands your tone and style" },
    { skill: "Product Preferences", level: 87, description: "Knows what you like and dislike" },
    { skill: "Shopping Habits", level: 72, description: "Learning your buying patterns" },
    { skill: "Support Needs", level: 90, description: "Knows how you like to be helped" },
    { skill: "Time Preferences", level: 65, description: "Learning your schedule patterns" }
  ];

  const nextMilestones = [
    { milestone: "50 Conversations", current: 47, target: 50, reward: "Accuracy boost +5%" },
    { milestone: "30 Preferences", current: 23, target: 30, reward: "Better recommendations" },
    { milestone: "Expert Level", current: 78, target: 100, reward: "Full customization unlocked" }
  ];

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
              <h1 className="text-3xl font-bold gradient-text">Training Details</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Complete overview of your digital twin's learning progress
              </p>
            </div>
          </div>
          <Button className="bg-gradient-primary" onClick={() => navigate("/chat")}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Start Training Session
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Brain className="h-8 w-8 text-purple-500" />
                <Badge className="bg-blue-500">Learning</Badge>
              </div>
              <p className="text-3xl font-bold">{trainingMetrics.overallProgress}%</p>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <MessageSquare className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-3xl font-bold">{trainingMetrics.conversationsAnalyzed}</p>
              <p className="text-sm text-muted-foreground">Conversations Analyzed</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <Sparkles className="h-8 w-8 text-yellow-500 mb-2" />
              <p className="text-3xl font-bold">{trainingMetrics.preferencesLearned}</p>
              <p className="text-sm text-muted-foreground">Preferences Learned</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <ThumbsUp className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-3xl font-bold">{trainingMetrics.accuracyRate}%</p>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Skills Breakdown */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Skills Breakdown
                </CardTitle>
                <CardDescription>
                  How well your twin understands different aspects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {skillsLearned.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{skill.skill}</p>
                        <p className="text-xs text-muted-foreground">{skill.description}</p>
                      </div>
                      <Badge variant="outline">{skill.level}%</Badge>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Training History */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Training Activity
                </CardTitle>
                <CardDescription>
                  Your training sessions over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trainingHistory.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{day.date}</p>
                          <p className="text-xs text-muted-foreground">
                            {day.conversations} conversations
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <div className="text-center">
                          <p className="font-bold text-purple-500">{day.preferencesLearned}</p>
                          <p className="text-muted-foreground">Preferences</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-green-500">+{day.accuracyImprovement}%</p>
                          <p className="text-muted-foreground">Accuracy</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Next Milestones */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Next Milestones
                </CardTitle>
                <CardDescription>
                  Goals to unlock new features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {nextMilestones.map((milestone, index) => (
                  <div key={index} className="space-y-2 p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{milestone.milestone}</p>
                      <Badge variant="outline" className="text-xs">
                        {milestone.current}/{milestone.target}
                      </Badge>
                    </div>
                    <Progress value={(milestone.current / milestone.target) * 100} className="h-2" />
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{milestone.reward}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Training Tips */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Training Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Chat regularly with your twin to improve accuracy
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Provide feedback on responses to teach preferences
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Update personality settings when your style changes
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Connect to more brands for diverse learning
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Training Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm">Training Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Started:</span>
                  <span className="font-medium">{trainingMetrics.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Session:</span>
                  <span className="font-medium">{trainingMetrics.lastTraining}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-blue-500">{trainingMetrics.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetailsPage;