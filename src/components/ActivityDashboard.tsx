import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";

const ActivityDashboard = () => {
  // Interactions over time (last 7 days)
  const interactionData = [
    { day: 'Mon', interactions: 12, accuracy: 92 },
    { day: 'Tue', interactions: 15, accuracy: 93 },
    { day: 'Wed', interactions: 8, accuracy: 91 },
    { day: 'Thu', interactions: 18, accuracy: 94 },
    { day: 'Fri', interactions: 14, accuracy: 95 },
    { day: 'Sat', interactions: 10, accuracy: 93 },
    { day: 'Sun', interactions: 11, accuracy: 94 }
  ];

  // Interactions by brand
  const brandData = [
    { brand: 'TechCorp', interactions: 28, satisfaction: 96 },
    { brand: 'FashionHub', interactions: 18, satisfaction: 92 },
    { brand: 'HealthPlus', interactions: 22, satisfaction: 98 }
  ];

  // Sentiment distribution
  const sentimentData = [
    { name: 'Positive', value: 68, percentage: 68 },
    { name: 'Neutral', value: 25, percentage: 25 },
    { name: 'Negative', value: 7, percentage: 7 }
  ];

  const COLORS = {
    primary: '#8b5cf6',
    secondary: '#3b82f6',
    positive: '#10b981',
    neutral: '#f59e0b',
    negative: '#ef4444'
  };

  const sentimentColors = [COLORS.positive, COLORS.neutral, COLORS.negative];

  return (
    <div className="space-y-6">
      {/* Interactions Over Time */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Interactions Over Time
          </CardTitle>
          <CardDescription>
            Your daily interaction count and accuracy trend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={interactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="day" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="interactions" 
                stroke={COLORS.primary} 
                strokeWidth={3}
                dot={{ fill: COLORS.primary, r: 5 }}
                activeDot={{ r: 8 }}
                name="Interactions"
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke={COLORS.positive} 
                strokeWidth={3}
                dot={{ fill: COLORS.positive, r: 5 }}
                name="Accuracy %"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactions by Brand */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Interactions by Brand
            </CardTitle>
            <CardDescription>
              Compare your activity across different brands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={brandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="brand" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="interactions" 
                  fill={COLORS.secondary} 
                  radius={[8, 8, 0, 0]}
                  name="Interactions"
                />
                <Bar 
                  dataKey="satisfaction" 
                  fill={COLORS.positive} 
                  radius={[8, 8, 0, 0]}
                  name="Satisfaction %"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Sentiment Distribution
            </CardTitle>
            <CardDescription>
              Overall sentiment of your conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sentimentColors[index % sentimentColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {sentimentData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sentimentColors[index] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Average Response Time</p>
              <p className="text-3xl font-bold text-purple-500">2.3s</p>
              <p className="text-xs text-green-600 flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                15% faster than last week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Resolution Rate</p>
              <p className="text-3xl font-bold text-green-500">87%</p>
              <p className="text-xs text-green-600 flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                5% improvement
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Customer Satisfaction</p>
              <p className="text-3xl font-bold text-blue-500">4.7/5</p>
              <p className="text-xs text-green-600 flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +0.2 from last month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityDashboard;