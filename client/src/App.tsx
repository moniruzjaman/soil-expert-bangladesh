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
import SoilTest from "./pages/SoilTest";
import Calendar from "./pages/Calendar";
import Yield from "./pages/Yield";
import Export from "./pages/Export";
import PrintReport from "./pages/PrintReport";
import Efficiency from "./pages/Efficiency";
import About from "./pages/About";

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
      <Route path={"/soil-test"} component={SoilTest} />
      <Route path={"/calendar"} component={Calendar} />
      <Route path={"/yield"} component={Yield} />
      <Route path={"/export"} component={Export} />
      <Route path={"/print-report"} component={PrintReport} />
      <Route path={"/efficiency"} component={Efficiency} />
      <Route path={"/about"} component={About} />
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
