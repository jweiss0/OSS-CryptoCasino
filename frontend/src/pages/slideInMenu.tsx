import React, { Component } from "react";
import { Link } from "react-router-dom";

class SlideInMenu extends Component<any, any> {
    render() {
        var visibility = "hide";

        if (this.props.menuVisibility) {
            visibility = "show";
        }

        return (
            <div id="flyoutMenu"
                //onMouseLeave={this.props.handleMouseDown}
                className={visibility}>
                <h3>Settings</h3>
                <div className="settingsRow">
                    <div className="settingsLeft">Theme:</div>
                    <div className="settingsRight">
                        <label className="switch">
                            <input type="checkbox" id="togBtn"></input>
                            <div className="slider round"></div>
                        </label>
                    </div>
                </div>
                <div className="settingsRow">
                    <div className="settingsLeft">Metamask:</div>
                    <Link to={{ pathname: "https://metamask.io/" }} target="_blank"><img className="settingsRight" src="MetaMask_Fox.png" height="50" width="50"></img></Link>
                </div>
                <div className="settingsRow">
                    <div className="settingsLeft">About:</div>
                </div>
                <div className="contribute">
                    <div className="settingsLeft">contribute:</div>
                    <Link to={{ pathname: "https://github.com/jweiss0/OSS-CryptoCasino" }} target="_blank"><img className="settingsRight" src="githubIcon.png" height="30" width="30"></img></Link>
                </div>
            </div>
        );
    }
}

export default SlideInMenu;