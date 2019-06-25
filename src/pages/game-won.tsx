import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Games from "../models/Games";
import Loading from "../components/Loading";
import "./game-won.css";
import "../components/Button.css"
import BombFinder from "../logic/BombFinder";

interface ParamProps {
    id: string;
}

type Props = RouteComponentProps<ParamProps>;

type State = {
    loading: boolean,
    moves?: number,
    time?: number,
    difficulty?: string,
    rafId?: number,
    lastFrame?: number,
}

export default class GameWon extends Component<Props, State> {

    private keepUpdating: boolean = true;
    private canvas?: HTMLCanvasElement;
    private context2D?: CanvasRenderingContext2D;
    private game?: BombFinder;

    state = {
        loading: false,
        moves: undefined,
        time: undefined,
        difficulty: undefined,
        rafId: undefined,
        lastFrame: undefined,
    }

    async componentDidMount() {
        const game = await Games.GetById(this.props.match.params.id);
        this.setState({
            loading: false,
            moves: game.totalMoves,
            time: game.time,
            difficulty: game.difficulty,
            lastFrame: 0
        });
        this.canvas = document.getElementById("piece-canvas") as HTMLCanvasElement;
        this.context2D = this.canvas.getContext('2d')!;
    }

    componentWillUnmount() {
        if (this.state.rafId) {
            cancelAnimationFrame(this.state.rafId!);
        }
        this.keepUpdating = false;
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
                <canvas id="piece-canvas" width="300" height="300"></canvas>
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

    private draw = (delta: number) => {
        const elapsedTime = delta - this.state.lastFrame!;
        this.game!.update(elapsedTime);
        this.game!.draw(this.context2D!);
        if (this.keepUpdating) {
            this.setState({
                rafId: requestAnimationFrame(this.draw),
                lastFrame: delta,
            })
        }
    } 
}
