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
import Web3DappPage from "@/pages/web3-dapp";
import OrderFiNew from "@/pages/orderfi-new";
import OrderFiSimple from "./pages/orderfi-simple";
import TokenRewardsPage from "@/pages/tokenrewards";
import NetworkPage from "@/pages/network";
import NotFound from "@/pages/not-found";
import TestThree from "@/pages/test-three";
import VisualizationPlatform from "@/pages/visualization-platform";
import SimpleVisualization from "@/pages/simple-visualization";
import MobileChatPage from "@/pages/mobile-chat";
import { useEffect, useState } from "react";
import { useChatContext } from "@/contexts/ChatContext";

// Import all 8 MVP Venue Console admin pages
import SimplifiedInventoryPage from "@/pages/admin/inventory-simplified";
import AdminInventoryStockPage from "@/pages/admin/inventory-stock";
import AdminOrdersPage from "@/pages/admin/orders-new";
import AdminPaymentsPage from "@/pages/admin/payments";
import AdminStockPage from "@/pages/admin/stock";

import AdminStaffPage from "@/pages/admin/staff";
import AdminReportingPage from "@/pages/admin/reporting";
import AdminSettingsPage from "@/pages/admin/settings";

// Customer MVP Pages
import CustomerLogin from "@/pages/customer/login";
import CustomerMenu from "@/pages/customer/menu";
import EnhancedCustomerMenu from "@/pages/customer/menu-enhanced";
import ScanPage from "@/pages/customer/scan";
import CustomerCart from "@/pages/customer/cart";
import CustomerCheckout from "@/pages/customer/checkout";
import OrderStatus from "@/pages/customer/order-status";
import CustomerSettings from "@/pages/customer/settings";

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState('256px');
  
  // Hide navigation on pages that have their own header/navigation (StandardLayout or custom headers)
  const hideNavigation = [
    '/customer',
    '/scan',
    '/login',
    '/menu',
    '/menu-simple',
    '/cart',
    '/checkout',
    '/order-status',
    '/landing-page', 
    '/not-found', 
    '/tokenrewards',
    '/network', 
    '/inventory',
    '/inventory-simplified',
    '/stock',
    '/inventory-stock',
    '/orders',
    '/payments',
    '/stock',
    '/staff',
    '/reporting',
    '/settings'
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
    <div className="min-h-screen bg-background flex">
      {!hideNavigation && <Sidebar />}
      
      {/* Main content with sidebar offset */}
      <main 
        className={`flex-1 h-screen overflow-auto`} 
        style={{ 
          marginLeft: !hideNavigation ? sidebarWidth : '0'
        }}
      >
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
        <Route path="/landing-page" component={LandingPage} />
        

        {/* Dashboard - Default Home */}
        <Route path="/" component={HybridDashboard} />
        <Route path="/dashboard" component={HybridDashboard} />
        
        {/* Mobile App - QR Ordering System */}
        <Route path="/mobileapp" component={EnhancedCustomerMenu} />
        <Route path="/scan" component={ScanPage} />
        <Route path="/login" component={CustomerLogin} />
        <Route path="/menu" component={EnhancedCustomerMenu} />
        <Route path="/menu-simple" component={CustomerMenu} />
        <Route path="/cart" component={CustomerCart} />
        <Route path="/checkout" component={CustomerCheckout} />
        <Route path="/order-status/:orderId" component={OrderStatus} />
        
        {/* Customer-Facing Mobile Interface */}
        <Route path="/customer" component={OrderFiNew} />
        <Route path="/mobile-chat" component={MobileChatPage} />
        <Route path="/orderfi-simple" component={OrderFiSimple} />
        <Route path="/tokenrewards" component={TokenRewardsPage} />
        <Route path="/network" component={NetworkPage} />
        <Route path="/web3-order" component={Web3DappPage} />
        <Route path="/test-three" component={TestThree} />
        <Route path="/settings" component={CustomerSettings} />
        
        {/* MVP Venue Console - 8 Admin Pages */}
        <Route path="/inventory" component={SimplifiedInventoryPage} />
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
