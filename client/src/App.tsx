import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OperationsAiProvider } from "@/contexts/OperationsAiContext";
import HomePage from "@/pages/home";
import AdminPage from "@/pages/admin";
import CustomerPage from "@/pages/customer";
import MobileChatPage from "@/pages/mobile-chat";
import RetroChatPage from "@/pages/retro-chat";
import NotFound from "@/pages/not-found";
import OrderPage from "@/pages/order";
import AutomationPage from "@/pages/automation";
import RestaurantPage from "@/pages/restaurant";
import ControlCenter from "@/pages/control-center";

// Admin module pages
import MenuPage from "@/pages/menu";
import AdminMenuPage from "@/pages/admin/menu";
import AdminOrdersPage from "@/pages/admin/orders";
import AdminPaymentsPage from "@/pages/admin/payments";
import AdminRewardsPage from "@/pages/admin/rewards";
import AdminBlockchainPage from "@/pages/admin/blockchain";
import HybridChatPage from "@/pages/hybrid-chat";
import MobileAppPage from "@/pages/mobile-app";
import ChatbotPrimaryPage from "@/pages/chatbot-primary";
import { DownloadPage } from "@/pages/DownloadPage";

import { DecentralizedDashboard } from "@/pages/DecentralizedDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/menu" component={AdminMenuPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/payments" component={AdminPaymentsPage} />
      <Route path="/admin/rewards" component={AdminRewardsPage} />
      <Route path="/admin/blockchain" component={AdminBlockchainPage} />
      <Route path="/retro" component={RetroChatPage} />
      <Route path="/customer" component={MobileChatPage} />
      <Route path="/hybrid-chat" component={HybridChatPage} />
      <Route path="/mobile-app" component={MobileAppPage} />
      <Route path="/mimi-order" component={ChatbotPrimaryPage} />
      <Route path="/download" component={DownloadPage} />

      <Route path="/decentralized" component={DecentralizedDashboard} />
      <Route path="/order" component={OrderPage} />
      <Route path="/automation" component={AutomationPage} />
      <Route path="/restaurant" component={RestaurantPage} />
      <Route path="/control" component={ControlCenter} />
      <Route path="/legacy" component={CustomerPage} />
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
