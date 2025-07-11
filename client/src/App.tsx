import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OperationsAiProvider } from "@/contexts/OperationsAiContext";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatProvider } from "@/contexts/ChatContext";
import { CartProvider } from "@/contexts/CartContext";
import { Sidebar } from "@/components/Sidebar";
import HomePage from "@/pages/home";
import LandingPage from "@/pages/landing-page";
import HybridDashboard from "@/pages/dashboard-hybrid";
import OptimizedDashboard from "@/pages/dashboard-optimized";
import TokenRewardsPage from "@/pages/tokenrewards";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { useChatContext } from "@/contexts/ChatContext";
import CustomerAiChat from "@/components/CustomerAiChat";
import SuperiorDashboard from "@/components/SuperiorDashboard";
import { RealTimeProvider } from "@/components/RealTimeSync";
import { ContextAwareUIProvider } from "@/components/ContextAwareUI";

// Redirect component for menu route
function MenuRedirect() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    navigate('/mobileapp');
  }, [navigate]);
  
  return null;
}

// Import Essential Admin Pages
import SimplifiedInventoryPage from "@/pages/admin/inventory-simplified";
import AdminOrdersPage from "@/pages/admin/orders-new";
import AdminPaymentsPage from "@/pages/admin/payments";
import AdminStockPage from "@/pages/admin/stock";
import AdminStaffPage from "@/pages/admin/staff";
import AdminReportingPage from "@/pages/admin/reporting";
import AdminSettingsPage from "@/pages/admin/settings";
import KitchenPage from "@/pages/admin/kitchen";
import TablesPage from "@/pages/admin/tables";

// Customer MVP Pages
import CustomerLogin from "@/pages/customer/login";
import EnhancedCustomerMenu from "@/pages/customer/menu-enhanced";
import ScanPage from "@/pages/customer/scan";
import CustomerCart from "@/pages/customer/cart";
import CustomerCheckout from "@/pages/customer/checkout";
import OrderStatus from "@/pages/customer/order-status";

import DashboardMobile from "@/pages/dashboard-mobile";
import TestMobile from "@/pages/test-mobile";

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState('256px');
  const { isOpen, setIsOpen } = useChatContext();
  
  // Hide navigation on pages that have their own header/navigation (customer flows and special pages)
  const hideNavigation = [
    '/scan',
    '/login',
    '/cart',
    '/checkout',
    '/order-status',
    '/landing-page', 
    '/not-found',
    '/mobileapp',
    '/dashboard-mobile'
  ].includes(location) || location.startsWith('/order-status/');



  // Set app loaded state and change background after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoaded(true);
      document.body.classList.add('app-loaded');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Track sidebar width changes
  useEffect(() => {
    const updateSidebarWidth = () => {
      const width = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
      setSidebarWidth(width || '256px');
    };

    // Initial update
    updateSidebarWidth();

    // Watch for changes
    const observer = new MutationObserver(() => {
      updateSidebarWidth();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    return () => observer.disconnect();
  }, []);
  
  // Special handling for dashboard to remove padding
  const isDashboard = location === '/' || location === '/dashboard';
  
  return (
    <div className="min-h-screen bg-background">
      {children}
      {/* Global Chat Instance - Persists Across All Navigation */}
      <CustomerAiChat isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </div>
  );
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        {/* Landing Page */}
        <Route path="/landing-page" component={LandingPage} />
        

        {/* Dashboard - Default Home */}
        <Route path="/" component={() => (
          <RealTimeProvider>
            <ContextAwareUIProvider>
              <SuperiorDashboard />
            </ContextAwareUIProvider>
          </RealTimeProvider>
        )} />
        <Route path="/dashboard" component={() => (
          <RealTimeProvider>
            <ContextAwareUIProvider>
              <SuperiorDashboard />
            </ContextAwareUIProvider>
          </RealTimeProvider>
        )} />
        <Route path="/dashboard-hybrid" component={HybridDashboard} />
        <Route path="/dashboard-optimized" component={OptimizedDashboard} />
        <Route path="/dashboard-mobile" component={DashboardMobile} />
        <Route path="/test-mobile" component={TestMobile} />
        
        {/* Mobile App - QR Ordering System */}
        <Route path="/mobileapp" component={EnhancedCustomerMenu} />
        <Route path="/scan" component={ScanPage} />
        <Route path="/login" component={CustomerLogin} />
        <Route path="/menu" component={MenuRedirect} />
        <Route path="/cart" component={CustomerCart} />
        <Route path="/checkout" component={CustomerCheckout} />
        <Route path="/order-status/:orderId" component={OrderStatus} />
        
        {/* Token Rewards (keeping as separate feature) */}
        <Route path="/tokenrewards" component={TokenRewardsPage} />
        
        {/* Essential Admin Pages */}
        <Route path="/inventory" component={SimplifiedInventoryPage} />
        <Route path="/orders" component={AdminOrdersPage} />
        <Route path="/payments" component={AdminPaymentsPage} />
        <Route path="/stock" component={AdminStockPage} />
        <Route path="/staff" component={AdminStaffPage} />
        <Route path="/reporting" component={AdminReportingPage} />
        <Route path="/settings" component={AdminSettingsPage} />
        
        {/* New Restaurant Operations Pages */}
        <Route path="/kitchen" component={KitchenPage} />
        <Route path="/tables" component={TablesPage} />
        
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ChatProvider>
            <CartProvider>
              <OperationsAiProvider>
                <Toaster />
                <Router />
              </OperationsAiProvider>
            </CartProvider>
          </ChatProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
