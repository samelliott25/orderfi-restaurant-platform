import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home";
import AdminPage from "@/pages/admin";
import CustomerPage from "@/pages/customer";
import MobileChatPage from "@/pages/mobile-chat";
import RetroChatPage from "@/pages/retro-chat";
import NotFound from "@/pages/not-found";

// Admin module pages
import MenuPage from "@/pages/menu";
import AdminMenuPage from "@/pages/admin/menu";
import AdminUsersPage from "@/pages/admin/users";
import AdminOrdersPage from "@/pages/admin/orders";
import AdminSettingsPage from "@/pages/admin/settings";
import AdminAiTrainingPage from "@/pages/admin/ai-training";
import AdminInventoryPage from "@/pages/admin/inventory";
import AdminPaymentsPage from "@/pages/admin/payments";
import AdminMarketingPage from "@/pages/admin/marketing";
import AdminAnalyticsPage from "@/pages/admin/analytics";
import AdminRewardsPage from "@/pages/admin/rewards";
import AdminSecurityPage from "@/pages/admin/security";
import AdminIntegrationsPage from "@/pages/admin/integrations";
import HybridChatPage from "@/pages/hybrid-chat";
import MobileAppPage from "@/pages/mobile-app";
import ChatbotPrimaryPage from "@/pages/chatbot-primary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/menu" component={AdminMenuPage} />
      <Route path="/admin/ai-training" component={AdminAiTrainingPage} />
      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/inventory" component={AdminInventoryPage} />
      <Route path="/admin/payments" component={AdminPaymentsPage} />
      <Route path="/admin/marketing" component={AdminMarketingPage} />
      <Route path="/admin/analytics" component={AdminAnalyticsPage} />
      <Route path="/admin/rewards" component={AdminRewardsPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route path="/admin/security" component={AdminSecurityPage} />
      <Route path="/admin/integrations" component={AdminIntegrationsPage} />
      <Route path="/retro" component={RetroChatPage} />
      <Route path="/customer" component={MobileChatPage} />
      <Route path="/hybrid-chat" component={HybridChatPage} />
      <Route path="/mobile-app" component={MobileAppPage} />
      <Route path="/mimi-order" component={ChatbotPrimaryPage} />
      <Route path="/legacy" component={CustomerPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
