
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useIOSAppearance } from "@/hooks/useIOSAppearance";
import { OfflineNotice } from "@/components/ui/OfflineNotice";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useEffect, useState } from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Subscribe from "./pages/Subscribe";
import Success from "./pages/Success";
import Dashboard from "./pages/Dashboard";
import CreateNarrative from "./pages/CreateNarrative";
import ViewNarrative from "./pages/ViewNarrative";
import KnowledgeBase from "./pages/KnowledgeBase";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import IntegratedDashboard from "./pages/IntegratedDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Initialize iOS appearance handling
  useIOSAppearance();
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  useEffect(() => {
    // Check if Supabase is properly configured
    setSupabaseConfigured(isSupabaseConfigured());
  }, []);

  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Supabase Configuration Required</h1>
          <p className="text-gray-700 dark:text-gray-300">
            This application requires Supabase environment variables to be configured.
          </p>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-left">
            <p className="font-mono text-sm mb-2">Required environment variables:</p>
            <ul className="list-disc pl-5 font-mono text-sm">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Please contact your administrator or check the documentation for setup instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineNotice />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/success" element={<Success />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <IntegratedDashboard />
                </ProtectedRoute>
              } />
              <Route path="/integrated-dashboard" element={
                <ProtectedRoute>
                  <IntegratedDashboard />
                </ProtectedRoute>
              } />
              <Route path="/generate" element={
                <ProtectedRoute>
                  <CreateNarrative />
                </ProtectedRoute>
              } />
              <Route path="/view-narrative/:id" element={
                <ProtectedRoute>
                  <ViewNarrative />
                </ProtectedRoute>
              } />
              <Route path="/knowledge-base" element={
                <ProtectedRoute>
                  <KnowledgeBase />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/settings/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
