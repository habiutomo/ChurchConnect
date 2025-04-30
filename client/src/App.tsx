import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import Dashboard from "@/pages/Dashboard";
import Devotional from "@/pages/Devotional";
import Members from "@/pages/Members";
import Notifications from "@/pages/Notifications";
import Finance from "@/pages/Finance";
import Calendar from "@/pages/Calendar";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Route path="/devotional" component={Devotional}/>
      <Route path="/members" component={Members}/>
      <Route path="/notifications" component={Notifications}/>
      <Route path="/finance" component={Finance}/>
      <Route path="/calendar" component={Calendar}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col lg:flex-row min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-64">
            <Header onMobileMenuClick={() => setMobileNavOpen(!mobileNavOpen)} />
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Router />
              </div>
            </div>
          </main>
          <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
