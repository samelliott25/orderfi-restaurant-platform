import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OperationsAiProvider } from "@/contexts/OperationsAiContext";
import OrderFiPage from "@/pages/orderfi";
import RestaurantDashboard from "@/pages/dashboard";
import Web3DappPage from "@/pages/web3-dapp";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Customer-Facing Mobile Interface */}
      <Route path="/" component={OrderFiPage} />
      <Route path="/orderfi" component={OrderFiPage} />
      <Route path="/web3-order" component={Web3DappPage} />
      
      {/* Restaurant Dashboard */}
      <Route path="/dashboard" component={RestaurantDashboard} />
      
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
