import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import uuid from "../util/uuid";
import { GameDifficulty } from "../models/GameTypes";
import Games from "../models/Games";
import Loading from "../components/Loading";
import "./game-menu.css"
import Box from "../components/Box";

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

const configData: PrepareGame[] = [
    {
        difficulty: "easy",
        width: 8,
        height: 8,
        bombs: 10,
    },
    {
        difficulty: "medium",
        width: 8,
        height: 8,
        bombs: 40,
    },
    {
        difficulty: "medium",
        width: 24,
        height: 24,
        bombs: 99,
    }
];

// TODO: Add data to "Pieces Left" in Continue Playing section
//       It should look like "Pieces Left: 16/54"
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
                prepare.width *= 3;
                prepare.height *= 3;
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
        const { loading, unfinishedGames } = this.state;
        return (
            <div className="menu">
                <div className="menu__new">
                    {configData.map(g => 
                        <Box className="menu__new__item"
                            onClick={() => this.prepareDefaultGame("easy")}>
                            <h3>{g.difficulty}</h3>
                            <p><small><strong>Bombs: </strong>{g.bombs}</small></p>
                            <p><small><strong>Width: </strong>{g.width}</small></p>
                            <p><small><strong>Height: </strong>{g.height}</small></p>
                        </Box>
                    )}
                    <Box className="menu__new__item"
                        onClick={() => this.prepareDefaultGame("custom")}>
                        Custom
                    </Box>
                </div>
                {
                    (loading) ? <Loading /> : null
                }
                {
                    (unfinishedGames && unfinishedGames.length !== 0)
                    ? <React.Fragment>
                        <h3>Continue Playing</h3>
                        <div className="menu__continue">
                            {unfinishedGames!.map(g =>
                                <Box className="menu__continue__item"
                                    onClick={() => this.loadOldGame(g.id)}>
                                    {g.result} - {g.difficulty} - <time>{g.createdAt.toLocaleString()}</time> <br />
                                    <small>
                                        <strong>Bombs: </strong>{g.bombs}<br />
                                        <strong>Width: </strong>{g.width}<br />
                                        <strong>Height: </strong>{g.height}<br />
                                        <strong>Pieces Left: </strong>{g.invisiblePieces}<br />
                                        <strong>Time: </strong>{g.time}<br />
                                        <strong>Total Moves:</strong>{g.totalMoves}<br />
                                    </small>
                                </Box>
                            )}
                        </div>
                    </React.Fragment>
                    : null
                }

                {/* <CustomGameForm
                    show={this.state.showModal}
                    close={this.closeModal}
                    submit={this.createCustomGame} /> */}
            </div>
        );
    }
}

