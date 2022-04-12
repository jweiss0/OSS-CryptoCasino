import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RoulettePage from "./pages/RoulettePage";
import CasinoGame from "./pages/CasinoGame";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/roulette" element={<RoulettePage />} />
        <Route path="/blackjack" element={<CasinoGame mode={"blackjack"} />} />
        {/* <Route path="/slots" element={<CasinoGame mode={"slots"} />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
