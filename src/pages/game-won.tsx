import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Games from "../models/Games";
import Loading from "../components/Loading";
import "./game-won.css";

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
                <h1>GameWon Page!!!</h1>
                <ul className="game-won__stats">
                    <li>moves: {this.state.moves}</li>
                    <li>time: {this.state.time}</li>
                    <li>difficulty: {this.state.difficulty}</li>
                </ul>
                <ul className="game-won__options">
                    <li className="game-won__options__item">
                        <Link to={playAgain}>Play Again</Link>
                    </li>
                    <li className="game-won__options__item">
                        <Link to="/">Main Menu</Link>
                    </li>
                </ul>
            </div>
        );
    }
}
