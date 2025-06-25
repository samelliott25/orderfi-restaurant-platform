import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OperationsAiProvider } from "@/contexts/OperationsAiContext";
import HomePage from "@/pages/home";
import RestaurantDashboard from "@/pages/dashboard";
import Web3DappPage from "@/pages/web3-dapp";
import OrderFiPage from "@/pages/orderfi";
import NotFound from "@/pages/not-found";

// Keep only essential admin pages for dashboard integration
import AdminMenuPage from "@/pages/admin/menu";
import AdminOrdersPage from "@/pages/admin/orders";
import AdminPaymentsPage from "@/pages/admin/payments";
import AdminRewardsPage from "@/pages/admin/rewards";
import AdminBlockchainPage from "@/pages/admin/blockchain";

function Router() {
  return (
    <Switch>
      {/* Main Application Routes */}
      <Route path="/" component={HomePage} />
      
      {/* Customer-Facing Mobile Interface */}
      <Route path="/orderfi" component={OrderFiPage} />
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
