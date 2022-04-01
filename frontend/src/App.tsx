import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CasinoGame from "./pages/CasinoGame";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blackjack" element={<CasinoGame mode={"blackjack"} />} />
        {/* <Route path="/roulette" element={<CasinoGame mode={"roulette"} />} /> */}
        {/* <Route path="/slots" element={<CasinoGame mode={"slots"} />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
