import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { Passcode } from "@/pages/Passcode";
import { Home } from "@/pages/Home";
import { AudiencePlaybooks } from "@/pages/AudiencePlaybooks";
import { BrandVoice } from "@/pages/BrandVoice";
import { VisualIdentity } from "@/pages/VisualIdentity";
import { Templates } from "@/pages/Templates";
import { BrandGuidelines } from "@/pages/BrandGuidelines";
import { CarrierOverview } from "@/pages/CarrierOverview";
import { BrokersOverview } from "@/pages/BrokersOverview";
import { MarketIntelligence } from "@/pages/MarketIntelligence";
import { Redirect } from "wouter";
import { BattleCards } from "@/pages/BattleCards";
import { CampaignAnalysis } from "@/pages/CampaignAnalysis";
import { FileLibrary } from "@/pages/FileLibrary";
import { AssetGenerator } from "@/pages/AssetGenerator";
import { SocialImpact } from "@/pages/SocialImpact";
import { IntelDigest } from "@/pages/IntelDigest";
import { AdminTrends } from "@/pages/AdminTrends";
import { AdminApiKeys } from "@/pages/AdminApiKeys";
import { BrokerMeetingPrep } from "@/pages/BrokerMeetingPrep";
import { CampaignBuild } from "@/pages/CampaignBuild";
import NYEventLandingPage from "@/pages/NYEventLandingPage";
import { MarketingBudget } from "@/pages/MarketingBudget";

import NotFound from "@/pages/not-found";

const SESSION_KEY = "betterfly_unlocked";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/playbooks" component={AudiencePlaybooks} />
        <Route path="/playbooks/carriers/overview" component={CarrierOverview} />
        <Route path="/playbooks/brokers/overview" component={BrokersOverview} />
        <Route path="/playbooks/:audience" component={AudiencePlaybooks} />
        <Route path="/brand-guidelines" component={BrandGuidelines} />
        <Route path="/brand-guidelines/tone" component={BrandVoice} />
        <Route path="/brand-guidelines/visual-identity" component={VisualIdentity} />
        <Route path="/brand-voice">
          <Redirect to="/brand-guidelines/tone" replace />
        </Route>
        <Route path="/visual-identity">
          <Redirect to="/brand-guidelines/visual-identity" replace />
        </Route>
        <Route path="/templates" component={Templates} />
        <Route path="/file-library" component={FileLibrary} />
        <Route path="/market-intelligence/overview" component={MarketIntelligence} />
        <Route path="/market-intelligence/battle-cards" component={BattleCards} />
        <Route path="/market-intelligence/intel-digest" component={IntelDigest} />
        <Route path="/market-intelligence/trends" component={CampaignAnalysis} />
        <Route path="/market-intelligence">
          <Redirect to="/market-intelligence/intel-digest" replace />
        </Route>
        <Route path="/use-cases/broker-meeting-prep" component={BrokerMeetingPrep} />
        <Route path="/use-cases/campaign-build" component={CampaignBuild} />
        <Route path="/use-cases/competitive-review">
          <Redirect to="/market-intelligence/intel-digest" replace />
        </Route>
        <Route path="/asset-generator" component={AssetGenerator} />
        <Route path="/social-impact" component={SocialImpact} />
        <Route path="/admin/trends" component={AdminTrends} />
        <Route path="/marketing-budget" component={MarketingBudget} />
        <Route path="/admin/api-keys" component={AdminApiKeys} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [location] = useLocation();
  const isEventPage = location === "/ny-event";

  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      return false;
    }
  });

  function handleUnlock() {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {}
    setUnlocked(true);
  }

  if (isEventPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <NYEventLandingPage />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {unlocked ? <Router /> : <Passcode onUnlock={handleUnlock} />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
