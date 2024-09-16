import { useEffect } from "react";
import "./index.css";
import { AppRouter } from "./routes/AppRoute";
import { resetBodyStyles } from "./util/styleUtil";

function App() {
  useEffect(() => {
    resetBodyStyles();
  }, []);

  return <AppRouter />;
}

export default App;
