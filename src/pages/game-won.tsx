import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Games from "../models/Games";
import Loading from "../components/Loading";
import "./game-won.css";
import "../components/Button.css"

interface ParamProps {
    id: string;
}

type Props = RouteComponentProps<ParamProps>;

type State = {
    loading: boolean,
    moves?: number,
    time?: number,
    difficulty?: string,
}

export default class GameWon extends Component<Props> {

    state = {
        loading: false,
        moves: undefined,
        time: undefined,
        difficulty: undefined,
    }

    async componentDidMount() {
        const game = await Games.GetGame(this.props.match.params.id);
        this.setState({
            loading: false,
            moves: game.totalMoves,
            time: game.time,
            difficulty: game.difficulty,
        })
    }

    public render() {
        if (this.state.loading) {
            return <Loading />
        }
        const playAgain = `/game/${this.state.difficulty}`;
        return (
            <div className="game-won">
                <h1>
                    You Won!
                    <small className="game-won--caption">
                        {this.state.difficulty}
                    </small>
                </h1>
                <ul className="game-won__stats">
                    <li>moves: {this.state.moves}</li>
                    <li>time: {this.state.time}</li>
                </ul>
                <div className="game-won__options">
                    <Link className="game-won__options__item link-button" to={playAgain}>Play Again</Link>
                    <Link className="game-won__options__item link-button" to="/">Main Menu</Link>
                </div>
            </div>
        );
    }
}
