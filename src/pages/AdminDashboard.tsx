import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Building2, 
  MessageSquare, 
  TrendingUp,
  UserPlus,
  Settings,
  BarChart3,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface User {
  id: number;
  name: string;
  email: string;
  twinName?: string;
  joinedDate: string;
  status: 'active' | 'inactive';
}

interface Brand {
  id: number;
  name: string;
  industry: string;
  joinedDate: string;
  totalInteractions: number;
  status: 'active' | 'pending' | 'suspended';
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'users' | 'brands'>('users');

  // Mock data for now - you'll replace this with real API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          name: "Alice Johnson",
          email: "alice@example.com",
          twinName: "Alice's Digital Twin",
          joinedDate: "2025-01-15",
          status: 'active'
        },
        {
          id: 2,
          name: "Bob Smith",
          email: "bob@example.com",
          twinName: "Bob's Assistant",
          joinedDate: "2025-02-20",
          status: 'active'
        },
        {
          id: 3,
          name: "Carol White",
          email: "carol@example.com",
          twinName: "Carol Twin",
          joinedDate: "2025-03-10",
          status: 'inactive'
        },
      ]);

      setBrands([
        {
          id: 1,
          name: "TechCorp",
          industry: "Technology",
          joinedDate: "2025-01-10",
          totalInteractions: 1543,
          status: 'active'
        },
        {
          id: 2,
          name: "FashionHub",
          industry: "Retail",
          joinedDate: "2025-02-05",
          totalInteractions: 892,
          status: 'active'
        },
        {
          id: 3,
          name: "HealthPlus",
          industry: "Healthcare",
          joinedDate: "2025-03-15",
          totalInteractions: 0,
          status: 'pending'
        },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      icon: Users,
      description: `${users.filter(u => u.status === 'active').length} active`,
      color: "text-blue-600"
    },
    {
      title: "Active Brands",
      value: brands.filter(b => b.status === 'active').length.toString(),
      icon: Building2,
      description: `${brands.filter(b => b.status === 'pending').length} pending`,
      color: "text-green-600"
    },
    {
      title: "Total Interactions",
      value: brands.reduce((sum, b) => sum + b.totalInteractions, 0).toLocaleString(),
      icon: MessageSquare,
      description: "All time",
      color: "text-purple-600"
    },
    {
      title: "Platform Growth",
      value: "+23%",
      icon: TrendingUp,
      description: "vs last month",
      color: "text-orange-600"
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage InfiniServe platform users and brands
            </p>
          </div>
          <Button className="bg-gradient-primary">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
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
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
          <Button
            variant={activeTab === 'brands' ? 'default' : 'outline'}
            onClick={() => setActiveTab('brands')}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Brands
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Platform Users</CardTitle>
                  <CardDescription>
                    Manage all registered users and their digital twins
                  </CardDescription>
                </div>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr className="text-left">
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Name</th>
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Email</th>
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Digital Twin</th>
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Joined</th>
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                          {user.twinName || 'Not created'}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brands Table */}
        {activeTab === 'brands' && (
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Registered Brands</CardTitle>
                  <CardDescription>
                    Manage brands using InfiniServe platform
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  Add Brand
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr className="text-left">
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Brand Name</th>
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Industry</th>
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Joined</th>
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Interactions</th>
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                      <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBrands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {brand.name}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                          {brand.industry}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(brand.joinedDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                          {brand.totalInteractions.toLocaleString()}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            brand.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : brand.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {brand.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <Button variant="ghost" size="sm">
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;