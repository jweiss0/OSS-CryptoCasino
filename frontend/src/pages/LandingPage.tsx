import { Brand } from "../components/ui/Brand";
import logo from "../logo.svg";

export const LandingPage = () => {
  return (
    <main className="landing-page-container container min-vh-100 d-flex flex-column justify-content-center align-items-center gap-4 mx-auto w-100 text-center flex-lg-row justify-content-lg-between">
      <div>
        <div className="landing-page-image-container">
          <img className="landing-page-image" src={logo} alt="" />
        </div>
      </div>
      <div>
        <h1 className="landing-page-title">
          <Brand />
        </h1>
        <h2 className="landing-page-subtitle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel
          distinctio modi dolorem minima aliquam quos reprehenderit
        </h2>
        <a className="btn btn-primary" href="#">
          hop in
        </a>
      </div>
    </main>
  );
};

export default LandingPage;
