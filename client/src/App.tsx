import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OperationsAiProvider } from "@/contexts/OperationsAiContext";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatProvider } from "@/contexts/ChatContext";
import { Sidebar } from "@/components/Sidebar";
import HomePage from "@/pages/home";
import RestaurantDashboard from "@/pages/dashboard-new";
import Web3DappPage from "@/pages/web3-dapp";
import OrderFiNew from "@/pages/orderfi-new";
import OrderFiSimple from "./pages/orderfi-simple";
import TokenRewardsPage from "@/pages/tokenrewards";
import NetworkPage from "@/pages/network";
import NotFound from "@/pages/not-found";
import TestThree from "@/pages/test-three";
import VisualizationPlatform from "@/pages/visualization-platform";
import SimpleVisualization from "@/pages/simple-visualization";
import { useEffect, useState } from "react";

// Import all 8 MVP Venue Console admin pages
import AdminInventoryPage from "@/pages/admin/inventory";
import AdminInventoryStockPage from "@/pages/admin/inventory-stock";
import AdminOrdersPage from "@/pages/admin/orders-new";
import AdminPaymentsPage from "@/pages/admin/payments";
import AdminStockPage from "@/pages/admin/stock";
import AdminStaffPage from "@/pages/admin/staff";
import AdminReportingPage from "@/pages/admin/reporting";
import AdminSettingsPage from "@/pages/admin/settings";

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  
  // Hide navigation on pages that have their own header/navigation (StandardLayout or custom headers)
  const hideNavigation = [
    '/', 
    '/landing-page', 
    '/not-found', 
    '/dashboard',
    '/tokenrewards',
    '/network', 
    '/inventory',
    '/inventory-stock',
    '/orders',
    '/payments',
    '/stock',
    '/staff',
    '/reporting',
    '/settings'
  ].includes(location);

  // Set app loaded state and change background after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoaded(true);
      document.body.classList.add('app-loaded');
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Remove top padding for dashboard to push heading to very top
  const isDashboard = location === '/dashboard';
  
  return (
    <div className="min-h-screen bg-background flex">
      {!hideNavigation && <Sidebar />}
      
      {/* Main content with sidebar offset */}
      <main className={`${
        !hideNavigation ? "ml-80" : ""
      } flex-1 h-screen overflow-auto`} style={{ backgroundColor: '#fcfcfc' }}>
        {children}
      </main>
    </div>
  );
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        {/* Landing Page */}
        <Route path="/landing-page" component={HomePage} />
        
        {/* Customer-Facing Mobile Interface - Default Home */}
        <Route path="/" component={OrderFiNew} />
        <Route path="/orderfi-simple" component={OrderFiSimple} />
        <Route path="/tokenrewards" component={TokenRewardsPage} />
        <Route path="/network" component={NetworkPage} />
        <Route path="/web3-order" component={Web3DappPage} />
        <Route path="/test-three" component={TestThree} />
        
        {/* Back Office Dashboard */}
        <Route path="/dashboard" component={RestaurantDashboard} />
        
        {/* MVP Venue Console - 8 Admin Pages */}
        <Route path="/inventory" component={AdminInventoryPage} />
        <Route path="/inventory-stock" component={AdminInventoryStockPage} />
        <Route path="/orders" component={AdminOrdersPage} />
        <Route path="/payments" component={AdminPaymentsPage} />
        <Route path="/stock" component={AdminStockPage} />
        <Route path="/staff" component={AdminStaffPage} />
        <Route path="/reporting" component={AdminReportingPage} />
        <Route path="/settings" component={AdminSettingsPage} />
        
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
            <OperationsAiProvider>
              <Toaster />
              <Router />
            </OperationsAiProvider>
          </ChatProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
