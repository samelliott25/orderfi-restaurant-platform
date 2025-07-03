import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OperationsAiProvider } from "@/contexts/OperationsAiContext";
import { ThemeProvider } from "@/components/theme-provider";
import { HamburgerMenu, SearchBar } from "@/components/Navigation";
import HomePage from "@/pages/home";
import RestaurantDashboard from "@/pages/dashboard-new";
import Web3DappPage from "@/pages/web3-dapp";
import OrderFiClean from "@/pages/orderfi-clean";
import OrderFiSimple from "./pages/orderfi-simple";
import TokenRewardsPage from "@/pages/tokenrewards";
import NetworkPage from "@/pages/network";
import NotFound from "@/pages/not-found";
import TestThree from "@/pages/test-three";
import { useEffect, useState } from "react";

// Keep only essential admin pages for dashboard integration
import AdminInventoryPage from "@/pages/admin/inventory";
import AdminOrdersPage from "@/pages/admin/orders-new";
import AdminPaymentsPage from "@/pages/admin/payments";
import AdminRewardsPage from "@/pages/admin/rewards";
import AdminBlockchainPage from "@/pages/admin/blockchain";

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  
  // Hide navigation on pages that have their own header/navigation (StandardLayout or custom headers)
  const hideNavigation = [
    '/', 
    '/landing-page', 
    '/not-found', 
    '/orderfi-home',
    '/dashboard',
    '/tokenrewards',
    '/network', 
    '/inventory',
    '/admin/orders',
    '/payments'
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
    <div className="min-h-screen bg-background">
      {!hideNavigation && (
        <>
          <HamburgerMenu />
          <SearchBar />
        </>
      )}
      
      {/* Main content with padding only for top navigation */}
      <main className={
        !hideNavigation 
          ? isDashboard 
            ? "pt-0 h-screen overflow-auto" 
            : "pt-20 h-screen overflow-auto" 
          : "h-screen"
      } style={{ backgroundColor: '#fcfcfc' }}>
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
        <Route path="/" component={OrderFiClean} />
        <Route path="/orderfi-home" component={OrderFiClean} />
        <Route path="/orderfi-simple" component={OrderFiSimple} />
        <Route path="/tokenrewards" component={TokenRewardsPage} />
        <Route path="/network" component={NetworkPage} />
        <Route path="/web3-order" component={Web3DappPage} />
        <Route path="/test-three" component={TestThree} />
        
        {/* Back Office Dashboard */}
        <Route path="/dashboard" component={RestaurantDashboard} />
        
        {/* Admin Pages (accessed through dashboard) */}
        <Route path="/inventory" component={AdminInventoryPage} />
        <Route path="/admin/orders" component={AdminOrdersPage} />
        <Route path="/payments" component={AdminPaymentsPage} />
        <Route path="/admin/rewards" component={AdminRewardsPage} />
        <Route path="/admin/blockchain" component={AdminBlockchainPage} />
        
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
          <OperationsAiProvider>
            <Toaster />
            <Router />
          </OperationsAiProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
