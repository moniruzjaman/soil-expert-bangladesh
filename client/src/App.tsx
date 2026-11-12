import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
const Home = lazy(() => import("./pages/Home"));
const Fields = lazy(() => import("./pages/Fields"));
const SoilAssessment = lazy(() => import("./pages/SoilAssessment"));
const Fertilizer = lazy(() => import("./pages/Fertilizer"));
const Irrigation = lazy(() => import("./pages/Irrigation"));
const Chat = lazy(() => import("./pages/Chat"));
const Crops = lazy(() => import("./pages/Crops"));
const Knowledge = lazy(() => import("./pages/Knowledge"));
const Records = lazy(() => import("./pages/Records"));
const SoilTest = lazy(() => import("./pages/SoilTest"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Yield = lazy(() => import("./pages/Yield"));
const Export = lazy(() => import("./pages/Export"));
const PrintReport = lazy(() => import("./pages/PrintReport"));
const Efficiency = lazy(() => import("./pages/Efficiency"));
const About = lazy(() => import("./pages/About"));
const Help = lazy(() => import("./pages/Help"));
import { Moon, Sun } from "lucide-react";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background text-foreground"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600" /></div>}>
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
      <Route path={"/help"} component={Help} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
    </Suspense>
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
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <ThemeToggle />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      onClick={() => toggleTheme?.()}
      className="fixed bottom-4 right-4 z-[60] rounded-full bg-background/90 shadow-lg backdrop-blur"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export default App;
