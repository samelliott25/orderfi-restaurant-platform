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

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/menu" component={AdminMenuPage} />
      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route path="/retro" component={RetroChatPage} />
      <Route path="/customer" component={MobileChatPage} />
      <Route path="/mobile-chat" component={MobileChatPage} />
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
