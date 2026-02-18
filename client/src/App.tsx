import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AIAdvisor from "./pages/AIAdvisor";
import InvestmentWizard from "./pages/InvestmentWizard";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import VendorPortal from "./pages/VendorPortal";
import WhatsAppButton from "./components/WhatsAppButton";
import BecomePartner from "./pages/BecomePartner";
import Contracts from "./pages/Contracts";
import PartnerPortal from "./pages/PartnerPortal";
import Login from "./pages/Login";
import Contact from "./pages/Contact";

function Router() {
  function ScrollToTop() {
    const [location] = useLocation();

    useEffect(() => {
      // Force immediate scroll to top on route change
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      // Also try scrollTo with direct values as fallback
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, [location]);

    return null;
  }

  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/ai-advisor" component={AIAdvisor} />
      <Route path="/investment-wizard" component={InvestmentWizard} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/properties" component={Properties} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={Admin} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/list-your-property" component={VendorPortal} />
      <Route path="/partner-portal" component={PartnerPortal} />
      <Route path="/become-partner" component={BecomePartner} />
      <Route path="/login" component={Login} />
      <Route path="/contracts" component={Contracts} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
          <WhatsAppButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
