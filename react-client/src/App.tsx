import { useEffect } from "react";
import ReactGA from "react-ga4";
import "./index.css";
import { RollbarProvider } from "./infrastructure/telemetry/rollbar/RollbarProvider";
import { AppRouter } from "./routes/AppRoute";
import { GOOGLE_ANALYTICS_ID } from "./util/envUtil";
import { resetBodyStyles } from "./util/styleUtil";

function App() {
  // Initialize Google Analytics
  ReactGA.initialize(GOOGLE_ANALYTICS_ID);

  useEffect(() => {
    resetBodyStyles();
  }, []);

  return (
    <RollbarProvider>
      <AppRouter />
    </RollbarProvider>
  );
}

export default App;
