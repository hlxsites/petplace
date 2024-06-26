import Button from "./components/button/Button";
import "./index.css";
import { AppRouter } from "./routes/AppRoute";

function App() {
  return (
    <>
      <h1 className="text-primary-color">PetPlace React project</h1>
      <Button iconLeft={{ display: "check" }}>test</Button>
      <AppRouter />
    </>
  );
}

export default App;
