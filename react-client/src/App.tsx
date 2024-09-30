import { useEffect } from "react";
import "./index.css";
import { AppRouter } from "./routes/AppRoute";
import { resetBodyStyles } from "./util/styleUtil";
import { Rollbar } from "./routes/infrastructure/Rollbar";

function App() {
  useEffect(() => {
    resetBodyStyles();
  }, []);

  return (
    <Rollbar>
      <AppRouter />
    </Rollbar>
  );
}

export default App;
