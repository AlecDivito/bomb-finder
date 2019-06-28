import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./home.css"
import Games from "../models/Games";
import Loading from "../components/Loading";

interface State {
    loading: boolean;
    gameId?: string;
}

export default class Home extends Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: true,
            gameId: undefined,
        };
    }

    async componentDidMount() {
        const game = await Games.GetLastPlayedGame();
        if (game) {
            this.setState({ loading: false, gameId: game.id });
        } else {
            this.setState({ loading: false });
        }
    }

    public render() {
        if (this.state.loading) {
            return <Loading />
        }
        return (
            <div className="home">
                <div className="home__header">
                    <h1 className="home__header--center">Bomb Finder!</h1>
                </div>
                <ul className="home__list">
                    {
                        (this.state.gameId)
                            ? <li className="home__list__item">
                                <Link to={`/game/${this.state.gameId}`}>CONTINUE</Link>
                            </li>
                            : null
                    }
                    <li className="home__list__item">
                        <Link to="/menu">NEW GAME</Link>
                    </li>
                    <li className="home__list__item">
                        <Link to="/stats">STATISTICS</Link>
                    </li>
                    <li className="home__list__item">
                        <Link to="/about">ABOUT</Link>
                    </li>
                </ul>
            </div>
        );
    }
}
