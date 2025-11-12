import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, X, MessageCircle, Eye, Clock } from "lucide-react";
import { 
  addInteraction, 
  getCustomerStats, 
  getCustomerInteractions,
  formatTimeAgo,
  getAllCustomerStats,
  getInteractionIcon,
  getInteractionColor
} from "@/lib/interactionTracker";

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company_name?: string;
  street?: string;
  street2?: string;
  city?: string;
  state_id?: [number, string];
  zip?: string;
  country_id?: [number, string];
  website?: string;
  function?: string;
  category_id?: Array<[number, string]>;
  comment?: string;
}

interface CustomersPageProps {
  onNavigate: (page: string) => void;
}

const ODOO_URL = "/jsonrpc";
const DB = "infiniserve_db";
const USERNAME = "nehasaleem596@gmail.com";
const PASSWORD = "fypproject2025";

const CustomersPage = ({ onNavigate }: CustomersPageProps) => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // ✅ THIS WAS MISSING - Add this line:
  const [customerStats, setCustomerStats] = useState<{ [key: number]: any }>({});

  const generateInsightSummary = (customer: Customer): string => {
    const tags = customer.category_id?.map(t => {
      if (Array.isArray(t)) {
        return typeof t[1] === 'string' ? t[1].toLowerCase() : '';
      }
      return typeof t === 'string' ? t.toLowerCase() : '';
    }).filter(t => t) || [];
    
    const insights: string[] = [];

    if (tags.some(t => t.includes('vip') || t.includes('premium'))) {
      insights.push("High-value customer requiring premium service");
    }
    if (tags.some(t => t.includes('frequent') || t.includes('active'))) {
      insights.push("Highly engaged with regular interactions");
    }
    if (tags.some(t => t.includes('tech'))) {
      insights.push("Tech-savvy, prefers digital communication");
    }
    if (tags.some(t => t.includes('budget'))) {
      insights.push("Price-conscious, values cost-effectiveness");
    }
    if (tags.some(t => t.includes('b2b'))) {
      insights.push("Business customer, decision-maker");
    }

    if (customer.email && !customer.phone) {
      insights.push("Prefers email communication");
    } else if (customer.phone && customer.mobile) {
      insights.push("Accessible via multiple channels");
    }

    const hasFullProfile = customer.street && customer.city && customer.function;
    if (hasFullProfile) {
      insights.push("Complete profile available");
    }

    if (insights.length === 0) {
      return "Standard customer profile. Consider adding tags for better insights.";
    }

    return insights.join(". ") + ".";
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🔐 Attempting login to Odoo...");
        
        const loginPayload = {
          jsonrpc: "2.0",
          method: "call",
          params: { service: "common", method: "login", args: [DB, USERNAME, PASSWORD] },
          id: Date.now(),
        };

        const loginRes = await fetch(ODOO_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginPayload),
        });

        const loginData = await loginRes.json();
        console.log("✅ Login response:", loginData);

        const uid = loginData.result;
        if (!uid) throw new Error("Login failed");

        console.log("✅ Login successful! UID:", uid);
        console.log("📋 Fetching customers...");

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
              { fields: ["id", "name", "email", "phone", "mobile", "company_name", 
                         "street", "street2", "city", "state_id", "zip", "country_id",
                         "website", "function", "category_id", "comment"], limit: 50 },
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
        console.log("📦 Raw Odoo response:", customersData);
        console.log("📦 Number of records:", customersData.result?.length || 0);

        setCustomers(customersData.result || []);
        console.log("✅ Customers set successfully");
        
        // Load interaction stats for all customers
        const stats = getAllCustomerStats();
        setCustomerStats(stats);

      } catch (err: any) {
        console.error("❌ Error:", err);
        setError(err.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const query = searchQuery.toLowerCase();
    const name = c.name ? String(c.name).toLowerCase() : '';
    const email = c.email ? String(c.email).toLowerCase() : '';
    const phone = c.phone ? String(c.phone) : '';
    
    return name.includes(query) || email.includes(query) || phone.includes(query);
  });

  // Handle viewing customer details
  const handleViewCustomer = (customer: Customer) => {
    // Track the view interaction
    addInteraction(customer.id, customer.name, 'view', 'Viewed customer profile');
    
    // Refresh stats
    const stats = getAllCustomerStats();
    setCustomerStats(stats);
    
    // Open modal
    setSelectedCustomer(customer);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">
          Customers ({customers.length})
        </h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          className="flex-1 p-2 rounded-md border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      )}

      {!loading && filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl font-semibold mb-2">No customers found</p>
          <p className="text-muted-foreground">
            {customers.length === 0 
              ? "No customers in database. Add contacts in Odoo."
              : "No customers match your search."}
          </p>
        </div>
      )}

      {!loading && filteredCustomers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCustomers.map(c => (
            <Card 
              key={c.id} 
              className="glass-card cursor-pointer hover:shadow-glow transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  <span>{c.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {c.category_id && c.category_id.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      🎯 {c.category_id[0][1]}
                    </span>
                  </div>
                )}
                
                {c.email && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    📧 {c.email}
                  </p>
                )}
                {c.phone && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    📞 {c.phone}
                  </p>
                )}
                {c.function && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic truncate">
                    {c.function}
                  </p>
                )}
                {!c.email && !c.phone && (
                  <p className="text-xs text-gray-400 italic">No contact info</p>
                )}
                
                {/* Interaction Stats - Fixed with optional chaining */}
                {customerStats?.[c.id] && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {customerStats[c.id].totalInteractions} interactions
                      </span>
                      {customerStats[c.id].lastViewed && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(customerStats[c.id].lastViewed)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleViewCustomer(c)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
                    onClick={() => navigate(`/chat/${c.id}`)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedCustomer(null)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-xl p-8 w-full max-w-md relative shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setSelectedCustomer(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {selectedCustomer.name}
            </h2>
            
            {selectedCustomer.function && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedCustomer.function}
                {selectedCustomer.company_name && ` at ${selectedCustomer.company_name}`}
              </p>
            )}

            <div className="space-y-4">
              <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contact Information</p>
                {selectedCustomer.email && (
                  <p className="text-sm text-gray-900 dark:text-white mb-1">📧 {selectedCustomer.email}</p>
                )}
                {selectedCustomer.phone && (
                  <p className="text-sm text-gray-900 dark:text-white mb-1">📞 {selectedCustomer.phone}</p>
                )}
                {selectedCustomer.mobile && (
                  <p className="text-sm text-gray-900 dark:text-white mb-1">📱 {selectedCustomer.mobile}</p>
                )}
                {selectedCustomer.website && (
                  <p className="text-sm text-gray-900 dark:text-white">
                    🌐 <a href={selectedCustomer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedCustomer.website}</a>
                  </p>
                )}
              </div>

              {(selectedCustomer.street || selectedCustomer.city) && (
                <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Address</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCustomer.street && `${selectedCustomer.street}, `}
                    {selectedCustomer.street2 && `${selectedCustomer.street2}, `}
                    {selectedCustomer.city && `${selectedCustomer.city}, `}
                    {selectedCustomer.state_id && `${selectedCustomer.state_id[1]}, `}
                    {selectedCustomer.zip && `${selectedCustomer.zip}, `}
                    {selectedCustomer.country_id && selectedCustomer.country_id[1]}
                  </p>
                </div>
              )}

              {selectedCustomer.category_id && selectedCustomer.category_id.length > 0 && (
                <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Customer Insights & Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.category_id.map((tag) => {
                      const tagName = Array.isArray(tag) && tag[1] ? String(tag[1]).toLowerCase() : '';
                      const tagDisplay = Array.isArray(tag) && tag[1] ? String(tag[1]) : 'Unknown';
                      const tagId = Array.isArray(tag) && tag[0] ? tag[0] : Math.random();
                      
                      if (!tagName) return null;
                      
                      let colorClass = "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
                      
                      if (tagName.includes('frequent') || tagName.includes('active') || tagName.includes('email') || tagName.includes('quick')) {
                        colorClass = "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
                      } else if (tagName.includes('vip') || tagName.includes('premium') || tagName.includes('important')) {
                        colorClass = "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
                      } else if (tagName.includes('tech') || tagName.includes('budget') || tagName.includes('quality') || tagName.includes('enthusiast')) {
                        colorClass = "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
                      }
                      
                      return (
                        <span key={tagId} className={`px-3 py-1 ${colorClass} text-xs font-medium rounded-full`}>
                          {tagDisplay}
                        </span>
                      );
                    }).filter(Boolean)}
                  </div>
                  
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">💡 AI Insight</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{generateInsightSummary(selectedCustomer)}</p>
                  </div>
                </div>
              )}

              {selectedCustomer.comment && (
                <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes</p>
                  <div className="text-sm text-gray-900 dark:text-white prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedCustomer.comment }} />
                </div>
              )}

              <div className="pb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Customer ID</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedCustomer.id}</p>
              </div>
            </div>

            <Button className="mt-6 w-full" onClick={() => setSelectedCustomer(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;