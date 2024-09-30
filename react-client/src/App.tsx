import { useEffect } from "react";

import "./index.css";
import { RollbarProvider } from "./infrastructure/telemetry/rollbar/RollbarProvider";
import { AppRouter } from "./routes/AppRoute";
import { resetBodyStyles } from "./util/styleUtil";

function App() {
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
