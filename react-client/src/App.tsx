import { useEffect } from "react";
import "./index.css";
import { AppRouter } from "./routes/AppRoute";
import { resetBodyStyles } from "./util/styleUtil";

function App() {
  useEffect(() => {
    // document.body.className = "";
    resetBodyStyles();
  }, []);

  return <AppRouter />;
}

export default App;
