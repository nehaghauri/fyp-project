import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Building2, 
  MessageSquare, 
  TrendingUp,
  Shield,
  Activity,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const AdminHomePage = () => {
  const navigate = useNavigate();

  const platformStats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12% this month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Brands",
      value: "45",
      change: "+5 new this week",
      icon: Building2,
      color: "text-green-600"
    },
    {
      title: "Total Interactions",
      value: "23.5K",
      change: "+18% this month",
      icon: MessageSquare,
      color: "text-purple-600"
    },
    {
      title: "Platform Uptime",
      value: "99.9%",
      change: "All systems operational",
      icon: Activity,
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "User Management",
      description: "Manage all platform users",
      icon: Users,
      action: () => navigate("/admin")
    },
    {
      title: "Brand Management",
      description: "Approve and manage brands",
      icon: Building2,
      action: () => navigate("/admin")
    },
    {
      title: "Platform Analytics",
      description: "View detailed analytics",
      icon: TrendingUp,
      action: () => navigate("/admin")
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: Shield,
      action: () => navigate("/admin")
    }
  ];

  const recentActivity = [
    { type: "user", message: "New user registered: John Doe", time: "5 min ago", status: "success" },
    { type: "brand", message: "Brand application: TechCorp", time: "15 min ago", status: "pending" },
    { type: "user", message: "New user registered: Jane Smith", time: "1 hour ago", status: "success" },
    { type: "alert", message: "System maintenance scheduled", time: "2 hours ago", status: "info" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Control Panel
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage InfiniServe platform users, brands, and system settings
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformStats.map((stat) => (
            <Card key={stat.title} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="glass-card cursor-pointer hover:shadow-lg transition-all group"
                onClick={action.action}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">API Services</span>
                </div>
                <span className="text-xs text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Database</span>
                </div>
                <span className="text-xs text-green-600 font-medium">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">AI Models</span>
                </div>
                <span className="text-xs text-green-600 font-medium">Running</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">Scheduled Maintenance</span>
                </div>
                <span className="text-xs text-yellow-600 font-medium">Tomorrow 2AM</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;