import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Fields from "./pages/Fields";
import SoilAssessment from "./pages/SoilAssessment";
import Fertilizer from "./pages/Fertilizer";
import Irrigation from "./pages/Irrigation";
import Chat from "./pages/Chat";
import Crops from "./pages/Crops";
import Knowledge from "./pages/Knowledge";
import Records from "./pages/Records";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/fields"} component={Fields} />
      <Route path={"/soil-assessment"} component={SoilAssessment} />
      <Route path={"/fertilizer"} component={Fertilizer} />
      <Route path={"/irrigation"} component={Irrigation} />
      <Route path={"/chat"} component={Chat} />
      <Route path={"/crops"} component={Crops} />
      <Route path={"/knowledge"} component={Knowledge} />
      <Route path={"/records"} component={Records} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
