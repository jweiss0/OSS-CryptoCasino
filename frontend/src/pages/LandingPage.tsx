import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <main className="landing-page-container container min-vh-100 d-flex flex-column justify-content-center align-items-center gap-1 mx-auto w-100 text-center">
      <div>
        <div className="landing-page-image-container">
          <img className="landing-page-image" src="/logo.png" alt="" />
        </div>
      </div>
      <div>
        <h1 className="landing-page-title">
          A blockchain-based collection of casino games
        </h1>

        <Link to="/blackjack" className="btn btn-outline-dark me-2">
          Play Blackjack ♣️
        </Link>
        <Link to="/slots" className="btn btn-outline-dark me-2">
          Play Slots 🎰
        </Link>
        <Link to="/roulette" className="btn btn-outline-dark">
          Play Roulette 🎲
        </Link>
      </div>
    </main>
  );
};

export default LandingPage;
