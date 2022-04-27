import { Link } from "react-router-dom";
import React, { Component } from "react";
import { WalletConnector } from "../components/WalletConnector";
import { ClaimChips } from "../components/ClaimChips";
import Footer from './../components/ui/footer';
import SlideInMenu from "./slideInMenu";

class LandingPage extends Component<any, any>{
  constructor(props: {}) {
    super(props);

    this.state = {
      visible: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log("Clicked");
    this.setState(
      {
        visible: !this.state.visible
      }
    );
  }


  render() {
    return (
      <main className="landing-page-container container min-vh-100 d-flex flex-column justify-content-center align-items-center gap-1 mx-auto w-100 text-center">
        <img src="./settings.png" id="settingsIcon" alt="Settings" height="30px" width="30px" onClick={this.handleClick}></img>
        <SlideInMenu handleMouseDown={this.handleClick}
          menuVisibility={this.state.visible} />
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
        <WalletConnector />
        <ClaimChips />
        <Footer />
      </main>
    );
  }
};

export default LandingPage;
