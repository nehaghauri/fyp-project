import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CustomersPage from "./pages/CustomersPage";
import ChatPage from "./pages/ChatPage";
import GeneralChatPage from "./pages/GeneralChatPage";
import InsightsPage from "./pages/InsightsPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import AdminHomePage from "@/pages/AdminHomePage";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/customers" element={<CustomersPage onNavigate={() => window.location.href = "/"} />} />
          <Route path="/chat/:customerId" element={<ChatPage />} />
          <Route path="/chat" element={<GeneralChatPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/knowledge" element={<KnowledgeBasePage />} />
          <Route path="/admin-home" element={<AdminHomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;