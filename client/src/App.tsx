import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionConfig } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function AppRouter() {
  // Use base path for GitHub Pages, but allow it to work locally too
  const basePath = import.meta.env.DEV ? "" : "/rajswarnim-portfolio";
  
  return (
    <Router base={basePath}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

// The cinematic experience is dark-only; clear any stored light preference
// from the previous version of the site so ThemeProvider can't re-apply it.
if (localStorage.getItem("portfolio-theme") === "light") {
  localStorage.setItem("portfolio-theme", "dark");
}

function App() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </QueryClientProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
