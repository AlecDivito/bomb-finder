import React, { Component } from "react";
import { Link, RouteComponentProps, Redirect } from "react-router-dom";
import Games from "../models/Games";
import Loading from "../components/Loading";
import "./game-won.css";
import "../components/Button.css"
import BombFinderPieceRenderer from "../logic/BombFinderPieceRenderer";
import Button from "../components/Button";

interface ParamProps {
    id: string;
}

type Props = RouteComponentProps<ParamProps>;

type State = {
    loading: boolean,
    moves?: number,
    time?: number,
    difficulty?: string,
    gameId?: string,
    rafId?: number,
    lastFrame?: number,
}

export default class GameWon extends Component<Props, State> {

    private keepUpdating: boolean = true;
    private canvas?: HTMLCanvasElement;
    private context2D?: CanvasRenderingContext2D;
    private game?: Games;
    private pieceRenderer?: BombFinderPieceRenderer;

    constructor(props: Props) {
        super(props);
        this.state = {loading: true};
    }

    async componentDidMount() {
        this.game = await Games.GetById(this.props.match.params.id);
        this.game.logAndDestroy();
        this.setState({
            loading: false,
            moves: this.game.totalMoves,
            time: this.game.time,
            difficulty: this.game.difficulty,
            lastFrame: 0
        });
        this.canvas = document.getElementById("piece-canvas") as HTMLCanvasElement;
        this.context2D = this.canvas.getContext('2d')!;
        this.pieceRenderer = new BombFinderPieceRenderer(120, 0, 7);
        requestAnimationFrame(this.draw);
    }

    componentWillUnmount() {
        if (this.state.rafId) {
            cancelAnimationFrame(this.state.rafId!);
        }
        this.keepUpdating = false;
    }

    playAgain = async () => {
        const { difficulty, width, height, bombs } = this.game!;
        const newGame = await Games.Create(difficulty, width, height, bombs);
        this.setState({ gameId: newGame.id });
    }

    public render() {
        if (this.state.loading) {
            return <Loading />
        }
        if (this.state.gameId) {
            return <Redirect to={`/game/${this.state.gameId}`} />
        }
        return (
            <div className="game-won">
                <h1>
                    You Won!
                    <small className="game-won--caption">
                        {this.state.difficulty}
                    </small>
                </h1>
                <canvas id="piece-canvas" width="120" height="120"></canvas>
                <ul className="game-won__stats">
                    <li>moves: {this.state.moves}</li>
                    <li>time: {this.state.time!.toFixed(2)}</li>
                </ul>
                <div className="game-won__options">
                    <Button className="game-won__options__item link-button"
                        type="button"
                        text="Play Again"
                        onClick={this.playAgain}/>
                    <Link className="game-won__options__item link-button"
                        to="/">
                        Main Menu
                    </Link>
                </div>
            </div>
        );
    }

    private draw = (delta: number) => {
        const elapsedTime = delta - this.state.lastFrame!;
        this.pieceRenderer!.update(elapsedTime);
        this.context2D!.fillStyle = "#333";
        this.context2D!.fillRect(0, 0, 120, 120);
        this.pieceRenderer!.drawPlaceHolder(this.context2D!, 0, 0);
        if (this.keepUpdating) {
            this.setState({
                rafId: requestAnimationFrame(this.draw),
                lastFrame: delta,
            })
        }
    } 
}
