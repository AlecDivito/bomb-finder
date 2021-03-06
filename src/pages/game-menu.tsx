import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Games, { IGames } from "../models/Games";
import Loading from "../components/Loading";
import Box from "../components/Box";
import plus from "../assets/plus.svg";
import CustomGameConfig, { ICustomGameConfig } from "../models/CustomGameConfig";
import "./game-menu.css"

interface State {
    loading: boolean;
    gameId?: string;
    gameTemplates?: ICustomGameConfig[];
    gameLocation?: string;
    unfinishedGames?: IGames[];
}

export default class GameMenu extends Component<{}, State> {

    state: Readonly<State> = {
        loading: true,
    };

    async componentDidMount() {
        let gameTemplates = await CustomGameConfig.getAll();
        let unfinishedGames = await Games.GetUnfinishedGames();
        unfinishedGames = unfinishedGames.sort((a, b) => (a.invisiblePieces > b.invisiblePieces) ? 1 : -1);
        this.setState({ loading: false, unfinishedGames, gameTemplates });
    }

    loadOldGame = async (id: string) => {
        const game = this.state.unfinishedGames!.find(g => g.id === id);
        if (!game) {
            // TODO: log message that game doesn't exist
            return;
        }
        this.setState({ gameId: id, gameLocation: `/game/${id}` });
    }

    prepareGame = async (prepared: ICustomGameConfig) => {
        // TODO: Add error handling (add in Games first)
        let game = await Games.Create(prepared.name!, prepared.width, prepared.height, prepared.bombs);
        this.setState({ gameId: game.id, gameLocation: `/game/${game.id}` });
    }

    public render() {
        if (this.state && this.state.gameId && this.state.gameLocation) {
            return <Redirect to={this.state.gameLocation} />
        }
        const { loading, unfinishedGames, gameTemplates } = this.state;
        if (loading) {
            return <Loading />
        }
        return (
            <div className="menu">
                <h3 className="menu__header">
                    <span>New Game</span>
                    <Link to="/menu/manage" className="menu__header--link">Manage Templates</Link>
                </h3>
                <div className="menu__new">
                    {gameTemplates!.map((g, i) => 
                        <Box key={g.name} degree={(i * 25) + 100} className="menu__new__item"
                            onClick={() => this.prepareGame(g)}>
                            <h2 className="menu--title">{g.name}</h2>
                            <p><small><strong>Bombs: </strong>{g.bombs}</small></p>
                            <p><small><strong>Width: </strong>{g.width}</small></p>
                            <p><small><strong>Height: </strong>{g.height}</small></p>
                        </Box>
                    )}
                        <Box degree={(gameTemplates!.length * 25) + 100} className="menu__new__item">
                            <Link to="/menu/custom">
                                <h2>Custom</h2>
                                <img src={plus} alt="Add custom game" />
                            </Link>
                        </Box>
                </div>
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

