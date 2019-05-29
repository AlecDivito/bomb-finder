import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { GameDifficulty } from "../models/GameTypes";

interface ParamProps {
    game: GameDifficulty;
}

type Props = RouteComponentProps<ParamProps>;

export default class GameWon extends Component<Props> {

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
