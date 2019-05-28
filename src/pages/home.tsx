import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Home extends Component {
    public render() {
        return (
            <div>
                <h1>Bomb Finder!</h1>
                <ul>
                    <li><Link to="/play">Play</Link></li>
                    <li><Link to="/stats">Stats</Link></li>
                    <li><Link to="/how-to-play">How To Play</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </div>
        );
    }
}
