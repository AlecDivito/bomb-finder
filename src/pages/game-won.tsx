import React, { Component } from "react";
import { Link } from "react-router-dom";


export default class GameWon extends Component {

    public render() {
        return (
            <div>
                <h1>GameWon Page!!!</h1>
                <ul>
                    <li>
                        <Link to="/game/easy">Play Again</Link>
                    </li>
                    <li>
                        <Link to="/stats">All Stats</Link>
                    </li>
                    <li>
                        <Link to="/">Main Menu</Link>
                    </li>
                </ul>
            </div>
        );
    }
}
