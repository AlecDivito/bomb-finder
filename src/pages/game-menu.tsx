import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import uuid from "../util/uuid";
import { GameDifficulty } from "../models/GameTypes";
import Games from "../models/Games";

interface State {
    gameId?: string;
    gameLocation?: string;
}

export default class GameMenu extends Component<{}, State> {

    prepareDefaultGame = async (difficulty: GameDifficulty) => {
        const gameId = uuid();
        let game = undefined;
        switch (difficulty) {
            case "easy":
                game = new Games(gameId, difficulty, 8, 8, 10);
                break;
            case "medium":
                game = new Games(gameId, difficulty, 16, 16, 40);
                break;
            case "hard":
                game = new Games(gameId, difficulty, 24, 24, 99);
                break;
            case "custom":
                console.warn("please implement me (custom)");
                return;
            default: // ID
                console.warn("Please Implement me (Default)")
                return;
        }
        await game!.save();
        this.setState({ gameId, gameLocation: `/game/${gameId}` });
    }

    public render() {
        if (this.state && this.state.gameId && this.state.gameLocation) {
            return <Redirect to={this.state.gameLocation} />
        }
        return (
            <div>
                <h1>GameMenu!!!</h1>
                <ul>
                    <li>
                        <button onClick={() => this.prepareDefaultGame("easy")}>Easy</button>
                    </li>
                    <li>
                        <button onClick={() => this.prepareDefaultGame("medium")}>Medium</button>
                    </li>
                    <li>
                        <button onClick={() => this.prepareDefaultGame("hard")}>Hard</button>
                    </li>
                    <li>
                        <button onClick={() => this.prepareDefaultGame("custom")}>Custom</button>
                    </li>
                    <li>
                        Not Complete
                    </li>
                </ul>
            </div>
        );
    }
}
