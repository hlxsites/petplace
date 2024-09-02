import { useEffect } from "react";
import "./index.css";
import { AppRouter } from "./routes/AppRoute";
import { resetBodyStyles } from "./util/styleUtil";

type AppProps = {
  authToken: string | null;
};

function App({ authToken }: AppProps) {
  useEffect(() => {
    resetBodyStyles();
  }, []);

  return (
    <>
      <AppRouter />
      {authToken && <input id="auth-token" type="hidden" value={authToken} />}
    </>
  );
}

export default App;
