import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OperationsAiProvider } from "@/contexts/OperationsAiContext";
import { lazy, Suspense } from "react";
import RestaurantDashboard from "@/pages/dashboard";
import Web3DappPage from "@/pages/web3-dapp";
import OrderFiPage from "@/pages/orderfi";
import NotFound from "@/pages/not-found";
import AdminDashboard from "./pages/AdminDashboard";

const RestaurantOnboarding = lazy(() => import("./pages/RestaurantOnboarding"));

function Router() {
  return (
    <Switch>
      {/* Platform Admin Dashboard */}
      <Route path="/" component={AdminDashboard} />
      <Route path="/onboard">
        <Suspense fallback={<div>Loading...</div>}>
          <RestaurantOnboarding />
        </Suspense>
      </Route>
      
      {/* Restaurant-specific routes */}
      <Route path="/dashboard/:slug?" component={RestaurantDashboard} />
      <Route path="/:restaurantSlug" component={OrderFiPage} />
      
      {/* Legacy routes for backward compatibility */}
      <Route path="/orderfi" component={OrderFiPage} />
      <Route path="/web3-order" component={Web3DappPage} />
      
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
