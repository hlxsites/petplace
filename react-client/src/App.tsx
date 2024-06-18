import "./App.css";
import "../../styles/styles.css";
import { AppRouter } from "./routes/AppRoute";

function App() {
  return (
    <>
      <h1 className="text-black">PetPlace React project</h1>
      <AppRouter />
    </>
  );
}

export default App;
