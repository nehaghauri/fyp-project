
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import Index from "./pages/Index";
import CustomersPage from "./pages/CustomersPage";
import ChatPage from "./pages/ChatPage";
import GeneralChatPage from "./pages/GeneralChatPage";
import PersonalityPage from "@/pages/PersonalityPage";
import InsightsPage from "./pages/InsightsPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import AdminHomePage from "@/pages/AdminHomePage";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import BrandDiscoveryPage from "@/pages/BrandDiscoveryPage";
import TrainingDetailsPage from "@/pages/TrainingDetailsPage";
import ConversationHistoryPage from "@/pages/ConversationHistoryPage";
import ActivityAnalyticsPage from "@/pages/ActivityAnalyticsPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* User Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customers" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <CustomersPage onNavigate={() => window.location.href = "/"} />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/brands" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <BrandDiscoveryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat/:customerId" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <GeneralChatPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/insights" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <InsightsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/knowledge" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <KnowledgeBasePage />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin-home" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminHomePage />
                </ProtectedRoute>
              } 
              
            />

            <Route 
              path="/history" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <ConversationHistoryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <PersonalityPage />
                </ProtectedRoute>
              } 
            />

            import TrainingDetailsPage from "@/pages/TrainingDetailsPage";

            <Route 
              path="/training" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <TrainingDetailsPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <ActivityAnalyticsPage />
                </ProtectedRoute>
              } 
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;