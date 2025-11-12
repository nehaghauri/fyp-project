import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  Globe, 
  Tag,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";
import {
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
} from "recharts";

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  country_id?: [number, string];
  category_id?: Array<[number, string]>;
  create_date?: string;
}

const ODOO_URL = "/jsonrpc";
const DB = "infiniserve_db";
const USERNAME = "nehasaleem596@gmail.com";
const PASSWORD = "fypproject2025";

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const InsightsPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    withEmail: 0,
    withPhone: 0,
    withTags: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Login
      const loginPayload = {
        jsonrpc: "2.0",
        method: "call",
        params: { 
          service: "common", 
          method: "login", 
          args: [DB, USERNAME, PASSWORD] 
        },
        id: Date.now(),
      };

      const loginRes = await fetch(ODOO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      const loginData = await loginRes.json();
      const uid = loginData.result;

      if (!uid) throw new Error("Login failed");

      // Fetch customers
      const customersPayload = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "object",
          method: "execute_kw",
          args: [
            DB,
            uid,
            PASSWORD,
            "res.partner",
            "search_read",
            [[]],
            { 
              fields: [
                "id", "name", "email", "phone", "city", 
                "country_id", "category_id", "create_date"
              ], 
              limit: 100 
            },
          ],
        },
        id: Date.now() + 1,
      };

      const customersRes = await fetch(ODOO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customersPayload),
      });

      const customersData = await customersRes.json();
      const fetchedCustomers = customersData.result || [];
      
      setCustomers(fetchedCustomers);
      
      // Calculate stats
      setStats({
        total: fetchedCustomers.length,
        withEmail: fetchedCustomers.filter((c: Customer) => c.email).length,
        withPhone: fetchedCustomers.filter((c: Customer) => c.phone).length,
        withTags: fetchedCustomers.filter((c: Customer) => c.category_id && c.category_id.length > 0).length
      });

    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Process tag distribution
  const getTagDistribution = () => {
    const tagCounts: { [key: string]: number } = {};
    
    customers.forEach(customer => {
      if (customer.category_id && customer.category_id.length > 0) {
        customer.category_id.forEach(tag => {
          const tagName = tag[1];
          tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  // Process country distribution
  const getCountryDistribution = () => {
    const countryCounts: { [key: string]: number } = {};
    
    customers.forEach(customer => {
      if (customer.country_id) {
        const countryName = customer.country_id[1];
        countryCounts[countryName] = (countryCounts[countryName] || 0) + 1;
      }
    });

    return Object.entries(countryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  // Process customer growth (mock data - you can enhance this with real dates)
  const getCustomerGrowth = () => {
    // Group by month based on create_date
    const monthCounts: { [key: string]: number } = {};
    
    customers.forEach(customer => {
      if (customer.create_date) {
        const date = new Date(customer.create_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      }
    });

    return Object.entries(monthCounts)
      .map(([month, count]) => ({ month, customers: count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  };

  const tagDistribution = getTagDistribution();
  const countryDistribution = getCountryDistribution();
  const customerGrowth = getCustomerGrowth();

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold gradient-text">Insights Dashboard</h1>
          <p className="text-muted-foreground">Real-time analytics from your Odoo data</p>
        </div>
        <Button onClick={fetchCustomers} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active contacts in database
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Email Contacts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.withEmail}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.withEmail / stats.total) * 100) : 0}% of total customers
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Phone Contacts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.withPhone}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.withPhone / stats.total) * 100) : 0}% reachable by phone
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tagged Customers</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.withTags}</div>
            <p className="text-xs text-muted-foreground mt-1">
              With behavioral insights
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tag Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Customer Segmentation by Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tagDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tagDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tagDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No tagged customers yet. Add tags in Odoo!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {countryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No location data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Growth Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Customer Growth Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customerGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="customers" fill="#3b82f6" name="New Customers" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>Growth data will appear as more customers are added</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm">Top Customer Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tagDistribution.slice(0, 5).map((tag, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{tag.name}</span>
                  <span className="text-sm text-muted-foreground">{tag.value}</span>
                </div>
              ))}
              {tagDistribution.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No tags yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm">Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {countryDistribution.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{country.name}</span>
                  <span className="text-sm text-muted-foreground">{country.value}</span>
                </div>
              ))}
              {countryDistribution.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No location data</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm">Data Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Complete Profiles</span>
                <span className="text-sm text-green-600 font-semibold">
                  {stats.total > 0 ? Math.round((stats.withEmail / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">With Tags</span>
                <span className="text-sm text-blue-600 font-semibold">
                  {stats.total > 0 ? Math.round((stats.withTags / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Contactable</span>
                <span className="text-sm text-purple-600 font-semibold">
                  {stats.total > 0 ? Math.round(((stats.withEmail + stats.withPhone) / (stats.total * 2)) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsightsPage;