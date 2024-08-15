import { useEffect } from "react";
import "./index.css";
import { AppRouter } from "./routes/AppRoute";

function App() {
  useEffect(() => {
    document.body.className = "";
  }, []);

  return <AppRouter />;
}

export default App;
