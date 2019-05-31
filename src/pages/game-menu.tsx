import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import uuid from "../util/uuid";
import { GameDifficulty } from "../models/GameTypes";
import Games from "../models/Games";
import Loading from "../components/Loading";
import CustomGameForm from "../components/CustomGameForm";

interface State {
    loading: boolean;
    showModal: boolean;
    gameId?: string;
    gameLocation?: string;
    unfinishedGames?: Games[];
}

type PrepareGame = {
    difficulty: GameDifficulty,
    width: number,
    height: number,
    bombs: number,
}

export default class GameMenu extends Component<{}, State> {

    state: Readonly<State> = {
        loading: true,
        showModal: false,
    };

    async componentDidMount() {
        const unfinishedGames = await Games.GetUnfinishedGames();
        this.setState({ loading: false, unfinishedGames });
    }

    prepareDefaultGame = async (difficulty: GameDifficulty) => {
        const prepare: PrepareGame = {
            difficulty: "easy",
            width: 8,
            height: 8,
            bombs: 10,
        }
        switch (difficulty) {
            case "easy":
                this.prepareGame(prepare);
                break;
            case "medium":
                prepare.width *= 2;
                prepare.height *= 2;
                prepare.bombs = 40;
                this.prepareGame(prepare);
                break;
            case "hard":
                prepare.width *= 24;
                prepare.height *= 24;
                prepare.bombs = 99;
                this.prepareGame(prepare);
                break;
            case "custom":
                this.setState({ showModal: true });
                return;
        }
    }

    loadOldGame = async (id: string) => {
        if (!this.state.unfinishedGames) {
            // TODO: log message that games aren't ready yet
            return;
        }
        const game = this.state.unfinishedGames!.find(g => g.id === id);
        if (!game) {
            // TODO: log message that game doesn't exist
            return;
        }
        this.setState({ gameId: id, gameLocation: `/game/${id}` });
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }

    createCustomGame = async  (data: { width: number, height: number, bombs: number}) => {
        this.setState({ showModal: false });
        const prepare: PrepareGame = { ...{difficulty: "custom" }, ...data };
        this.prepareGame(prepare);
    }

    prepareGame = async (prepared: PrepareGame) => {
        const gameId = uuid();
        let game = new Games(gameId, prepared.difficulty,
            prepared.width, prepared.height, prepared.bombs);
        await game.save();
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
                </ul>
                <h3>Continue Playing</h3>
                <ul>
                    {
                        (this.state.loading)
                        ? <Loading />
                        : this.state.unfinishedGames!.map(g =>
                            <li key={g.id} onClick={() => this.loadOldGame(g.id)}>
                                {g.result} - {g.difficulty} - <time>{g.createdAt.toLocaleString()}</time> <br />
                                <small>
                                    <strong>Bombs: </strong>{g.bombs}<br />
                                    <strong>Width: </strong>{g.width}<br />
                                    <strong>Height: </strong>{g.height}<br />
                                    <strong>Pieces Left: </strong>{g.invisiblePieces}<br />
                                    <strong>Time: </strong>{g.time}<br />
                                    <strong>Total Moves:</strong>{g.totalMoves}<br />
                                </small>
                            </li>
                        )
                    }
                </ul>

                <CustomGameForm
                    show={this.state.showModal}
                    close={this.closeModal}
                    submit={this.createCustomGame} />
            </div>
        );
    }
}

