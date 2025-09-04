import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Assignments } from "@/pages/Assignments";
import { Submissions } from "@/pages/Submissions";
import { AssignmentDetails } from "@/pages/AssignmentDetails";
import { Grading } from "@/pages/Grading";
import { Reports } from "@/pages/Reports";
import { Auth } from "@/pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute>
                <Layout>
                  <Assignments />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/submissions" element={
              <ProtectedRoute>
                <Layout>
                  <Submissions />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/assignments/:id" element={
              <ProtectedRoute>
                <Layout>
                  <AssignmentDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/grading" element={
              <ProtectedRoute>
                <Layout>
                  <Grading />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
