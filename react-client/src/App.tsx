import { useEffect } from "react";
import "./index.css";
import { AppRouter } from "./routes/AppRoute";

function App() {
  useEffect(() => {
    document.body.className = "";
    document.body.style.display = "block";
  }, []);

  return <AppRouter />;
}

export default App;
