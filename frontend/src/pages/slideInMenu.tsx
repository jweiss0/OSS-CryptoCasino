import React, { Component } from "react";

class SlideInMenu extends Component<any, any> {
    render() {
        var visibility = "hide";

        if (this.props.menuVisibility) {
            visibility = "show";
        }

        return (
            <div id="flyoutMenu"
                onMouseDown={this.props.handleMouseDown}
                className={visibility}>
                <h3></h3>
            </div>
        );
    }
}

export default SlideInMenu;