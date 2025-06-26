import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OperationsAiProvider } from "@/contexts/OperationsAiContext";
import { HamburgerMenu, SearchBar } from "@/components/Navigation";
import HomePage from "@/pages/home";
import RestaurantDashboard from "@/pages/dashboard";
import Web3DappPage from "@/pages/web3-dapp";
import OrderFiPage from "@/pages/orderfi";
import TokenRewardsPage from "@/pages/tokenrewards";
import NotFound from "@/pages/not-found";

// Keep only essential admin pages for dashboard integration
import AdminMenuPage from "@/pages/admin/menu";
import AdminOrdersPage from "@/pages/admin/orders";
import AdminPaymentsPage from "@/pages/admin/payments";
import AdminRewardsPage from "@/pages/admin/rewards";
import AdminBlockchainPage from "@/pages/admin/blockchain";

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  // Hide navigation on home page and certain other pages for full-screen experience
  const hideNavigation = ['/', '/not-found'].includes(location);
  
  // Remove top padding for dashboard to push heading to very top
  const isDashboard = location === '/dashboard';
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcfc' }}>
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
        {/* Main Application Routes */}
        <Route path="/" component={HomePage} />
        
        {/* Customer-Facing Mobile Interface */}
        <Route path="/orderfi" component={OrderFiPage} />
        <Route path="/tokenrewards" component={TokenRewardsPage} />
        <Route path="/web3-order" component={Web3DappPage} />
        
        {/* Back Office Dashboard */}
        <Route path="/dashboard" component={RestaurantDashboard} />
        
        {/* Admin Pages (accessed through dashboard) */}
        <Route path="/admin/menu" component={AdminMenuPage} />
        <Route path="/admin/orders" component={AdminOrdersPage} />
        <Route path="/admin/payments" component={AdminPaymentsPage} />
        <Route path="/admin/rewards" component={AdminRewardsPage} />
        <Route path="/admin/blockchain" component={AdminBlockchainPage} />
        
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OperationsAiProvider>
          <Toaster />
          <Router />
        </OperationsAiProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
