import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import uuid from "../util/uuid";
import { GameDifficulty } from "../models/GameTypes";
import Games from "../models/Games";
import Loading from "../components/Loading";
import { Modal } from "../components/Modal";

interface State {
    loading: boolean;
    showModal: boolean;
    gameId?: string;
    gameLocation?: string;
    unfinishedGames?: Games[];
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
                this.setState({ showModal: true });
                return;
            default: return;
        }
        await game!.save();
        this.setState({ gameId, gameLocation: `/game/${gameId}` });
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
        console.log('close');
    }

    createCustomGame = () => {
        console.log('submit');
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

                <Modal
                    header="Custom Game Wizard"
                    show={this.state.showModal}
                    close={this.closeModal}
                    submit={this.createCustomGame}>
                    Lets make a custom Game :)    
                </Modal>
            </div>
        );
    }
    
}
