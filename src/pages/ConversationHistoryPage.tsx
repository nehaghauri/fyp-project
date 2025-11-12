import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Search, 
  Filter,
  MessageSquare,
  Calendar,
  Download,
  Eye
} from "lucide-react";

interface Conversation {
  id: string;
  brandName: string;
  brandLogo: string;
  subject: string;
  summary: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  messagesCount: number;
  resolved: boolean;
}

const ConversationHistoryPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const conversations: Conversation[] = [
    {
      id: "1",
      brandName: "TechCorp",
      brandLogo: "🏢",
      subject: "Product inquiry about laptop specifications",
      summary: "Asked about RAM upgrade options for X1 Carbon. Received detailed specs and pricing.",
      date: "2025-11-12",
      sentiment: "positive",
      messagesCount: 8,
      resolved: true
    },
    {
      id: "2",
      brandName: "TechCorp",
      brandLogo: "🏢",
      subject: "Warranty extension question",
      summary: "Inquired about extending warranty. Got information about premium protection plan.",
      date: "2025-11-10",
      sentiment: "positive",
      messagesCount: 5,
      resolved: true
    },
    {
      id: "3",
      brandName: "FashionHub",
      brandLogo: "👗",
      subject: "Order status and delivery tracking",
      summary: "Checked status of order #12345. Confirmed delivery for Nov 15.",
      date: "2025-11-11",
      sentiment: "positive",
      messagesCount: 4,
      resolved: true
    },
    {
      id: "4",
      brandName: "FashionHub",
      brandLogo: "👗",
      subject: "Size exchange request",
      summary: "Requested size exchange for jeans. Process initiated, return label sent.",
      date: "2025-11-09",
      sentiment: "neutral",
      messagesCount: 6,
      resolved: true
    },
    {
      id: "5",
      brandName: "HealthPlus",
      brandLogo: "🏥",
      subject: "Appointment scheduling",
      summary: "Scheduled annual checkup for Nov 20 at 2 PM with Dr. Smith.",
      date: "2025-11-11",
      sentiment: "positive",
      messagesCount: 3,
      resolved: true
    },
    {
      id: "6",
      brandName: "HealthPlus",
      brandLogo: "🏥",
      subject: "Lab results inquiry",
      summary: "Asked about blood test results. Received confirmation that results are normal.",
      date: "2025-11-08",
      sentiment: "positive",
      messagesCount: 5,
      resolved: true
    },
    {
      id: "7",
      brandName: "TechCorp",
      brandLogo: "🏢",
      subject: "Technical support - software installation",
      summary: "Had issues installing driver. Support provided step-by-step solution.",
      date: "2025-11-07",
      sentiment: "neutral",
      messagesCount: 12,
      resolved: true
    },
    {
      id: "8",
      brandName: "FashionHub",
      brandLogo: "👗",
      subject: "Discount code not working",
      summary: "Reported issue with promo code. Issue escalated, waiting for resolution.",
      date: "2025-11-06",
      sentiment: "negative",
      messagesCount: 7,
      resolved: false
    }
  ];

  const brands = ["all", "TechCorp", "FashionHub", "HealthPlus"];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === "all" || conv.brandName === selectedBrand;
    const matchesSentiment = selectedSentiment === "all" || conv.sentiment === selectedSentiment;
    
    let matchesDate = true;
    if (dateRange !== "all") {
      const convDate = new Date(conv.date);
      const today = new Date();
      const daysAgo = Math.floor((today.getTime() - convDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateRange === "week" && daysAgo > 7) matchesDate = false;
      if (dateRange === "month" && daysAgo > 30) matchesDate = false;
    }
    
    return matchesSearch && matchesBrand && matchesSentiment && matchesDate;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "neutral":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "negative":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const handleExportAll = () => {
    console.log("Exporting all conversations...");
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
              <h1 className="text-3xl font-bold gradient-text">Conversation History</h1>
              <p className="text-muted-foreground text-sm mt-1">
                View and manage all your past interactions
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{conversations.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">
                    {conversations.filter(c => {
                      const daysAgo = Math.floor((new Date().getTime() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24));
                      return daysAgo <= 7;
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold">
                    {conversations.filter(c => c.resolved).length}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">
                    {conversations.filter(c => !c.resolved).length}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⏱</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Brand Filter */}
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.filter(b => b !== "all").map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sentiment Filter */}
              <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sentiments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Filter */}
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredConversations.length} of {conversations.length} conversations
          </p>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {filteredConversations.map((conv) => (
            <Card key={conv.id} className="glass-card hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-4xl">{conv.brandLogo}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{conv.subject}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{conv.summary}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">{conv.brandName}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{conv.messagesCount} messages</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {new Date(conv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className={getSentimentColor(conv.sentiment)}>
                      {conv.sentiment}
                    </Badge>
                    {conv.resolved ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                        Resolved
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        Pending
                      </Badge>
                    )}
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredConversations.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedBrand("all");
                setSelectedSentiment("all");
                setDateRange("all");
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConversationHistoryPage;