import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class GameMenu extends Component {

    public render() {
        return (
            <div>
                <h1>GameMenu!!!</h1>
                <ul>
                    <li>
                        <Link to="/game/easy">Easy</Link>
                    </li>
                    <li>
                        <Link to="/game/medium">Medium</Link>
                    </li>
                    <li>
                        <Link to="/game/hard">Hard</Link>
                    </li>
                    <li>
                        <Link to="/game/custom">Custom</Link>
                    </li>
                    <li>
                        Not Complete
                    </li>
                </ul>
            </div>
        );
    }
}
