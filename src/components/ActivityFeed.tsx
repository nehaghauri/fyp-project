import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { 
  getRecentInteractions, 
  formatTimeAgo,
  getInteractionIcon,
  getInteractionColor
} from "@/lib/interactionTracker";

const ActivityFeed = () => {
  const recentInteractions = getRecentInteractions(5);

  if (recentInteractions.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity yet</p>
            <p className="text-xs mt-1">Start viewing customers or chatting to see activity here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentInteractions.map((interaction) => (
            <div 
              key={interaction.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="text-2xl">{getInteractionIcon(interaction.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {interaction.customerName}
                </p>
                <p className={`text-xs ${getInteractionColor(interaction.type)}`}>
                  {interaction.type === 'view' && 'Viewed profile'}
                  {interaction.type === 'chat' && 'Chatted'}
                  {interaction.type === 'edit' && 'Edited details'}
                  {interaction.type === 'note' && 'Added note'}
                  {interaction.details && ` - ${interaction.details}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTimeAgo(interaction.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;