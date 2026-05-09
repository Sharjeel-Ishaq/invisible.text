import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import FreeFire from "@/pages/FreeFire";
import ReverseText from "@/pages/ReverseText";
import UnicodeConverter from "@/pages/UnicodeConverter";
import TextSpacer from "@/pages/TextSpacer";
import MirrorTextGenerator from "@/pages/MirrorTextGenerator";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Disclaimer from "@/pages/Disclaimer";
import NotFound from "@/pages/NotFound";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/blogs" component={Blog} />
      <Route path="/blogs/:slug" component={BlogPost} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/free-fire-text" component={FreeFire} />
      <Route path="/reverse-text" component={ReverseText} />
      <Route path="/mirror-text-generator" component={MirrorTextGenerator} />
      <Route path="/unicode-text-converter" component={UnicodeConverter} />
      <Route path="/text-spacer" component={TextSpacer} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={Privacy} />
      <Route path="/terms-and-conditions" component={Terms} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <Router />
          </WouterRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
