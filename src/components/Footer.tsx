import React from 'react';
import { Link } from 'react-router-dom';
import "./Footer.css"
import info from "../assets/info.svg";
import settings from "../assets/cog-f.svg";
import fullScreenIcon from "../assets/arrows-fullscreen.svg";

export default class Footer extends React.Component {

    fullscreen = () => {
        // TODO: Fix issue in typescript typing, for right now just any type it
        // https://github.com/Microsoft/TypeScript/issues/28681
        let doc = document as any;
        if (!doc.fullscreenElement) {
            doc.documentElement.requestFullscreen();
        } else {
            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            }
        }
    }

    render() {
        return (
            <footer className="footer">
                <Link to="/how-to-play">
                    <img src={info} alt="Info" />
                </Link>
                {(!document.fullscreenEnabled)
                    ? null
                    : <div onClick={this.fullscreen}>
                        <img src={fullScreenIcon} alt="fullscreen" />
                    </div>
                }
                <Link to="/settings">
                    <img src={settings} alt="Settings" />
                </Link>
            </footer>
        );
    }
}
