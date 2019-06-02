import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { GameDifficulty } from "../models/GameTypes";
import Games from "../models/Games";
import Loading from "../components/Loading";
import Box from "../components/Box";
import plus from "../assets/plus.svg";
import RandInRange from "../util/Random";
import uuid from "../util/uuid";
import "./game-menu.css"

interface State {
    loading: boolean;
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
        width: 16,
        height: 16,
        bombs: 40,
    },
    {
        difficulty: "hard",
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
    };

    async componentDidMount() {
        let unfinishedGames = await Games.GetUnfinishedGames();
        unfinishedGames = unfinishedGames.sort((a, b) => (a.invisiblePieces > b.invisiblePieces) ? 1 : -1);
        this.setState({ loading: false, unfinishedGames });
    }

    prepareDefaultGame = async (prepare: PrepareGame | string) => {
        if (typeof(prepare) === "object") {
            this.prepareGame(prepare);
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

    createCustomGame = async  (data: { width: number, height: number, bombs: number}) => {
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
                <h3>New Game</h3>
                <div className="menu__new">
                    {configData.map(g => 
                        <Box key={g.difficulty} degree={g.bombs + 170} className="menu__new__item"
                            onClick={() => this.prepareDefaultGame(g)}>
                            <h2 className="menu--title">{g.difficulty}</h2>
                            <p><small><strong>Bombs: </strong>{g.bombs}</small></p>
                            <p><small><strong>Width: </strong>{g.width}</small></p>
                            <p><small><strong>Height: </strong>{g.height}</small></p>
                        </Box>
                    )}
                        <Box degree={RandInRange(0, 360)} className="menu__new__item"
                            onClick={() => this.prepareDefaultGame("custom")}>
                    <Link to="/menu/custom">
                            <h2>Custom</h2>
                            <img src={plus} alt="Add custom game" />
                    </Link>
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
                                <Box key={g.id}
                                    degree={((((g.width * g.height) - g.bombs) - g.invisiblePieces) / (g.width * g.height) - g.bombs) * 360}
                                    className="menu__continue__item"
                                    onClick={() => this.loadOldGame(g.id)}>
                                    <h2 className="menu--title">{g.difficulty}</h2>
                                    <div className="menu__continue__details">
                                        <div>
                                            <p><small><strong>Bombs: </strong>{g.bombs}</small></p>
                                            <p><small><strong>Width: </strong>{g.width}</small></p>
                                            <p><small><strong>Height: </strong>{g.height}</small></p>
                                        </div>
                                        <div>
                                            {/* <p><small><strong>Start: </strong>{g.createdAt.toDateString()}</small></p> */}
                                            <p><small><strong>Pieces Left: </strong>{g.invisiblePieces}</small></p>
                                            <p><small><strong>Moves: </strong>{g.totalMoves}</small></p>
                                            <p><small><strong>Time: </strong>{Math.floor(g.time)}s</small></p>
                                        </div>
                                    </div>
                                </Box>
                            )}
                        </div>
                    </React.Fragment>
                    : null
                }
            </div>
        );
    }
}

