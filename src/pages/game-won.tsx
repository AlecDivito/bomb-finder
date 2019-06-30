import React, { Component } from "react";
import { Link, RouteComponentProps, Redirect } from "react-router-dom";
import Games from "../models/Games";
import Loading from "../components/Loading";
import "./game-won.css";
import "../components/Button.css"
import hourglass from "../assets/hourglass.svg";
import BombFinderPieceRenderer from "../logic/BombFinderPieceRenderer";
import Button from "../components/Button";
import { IPreferences } from "../models/Preferences";
import toHHMMSS from "../util/toHHMMSS";
import Statistics from "../models/Statistics";

interface ParamProps {
    id: string;
}

type Props = RouteComponentProps<ParamProps>;

type State = {
    loading: boolean,
    dimentions: number;
    winningText: string;
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
    private stats?: Statistics;
    private pieceRenderer?: BombFinderPieceRenderer;

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true,
            dimentions: 0,
            winningText: "",
        };
    }

    async componentDidMount() {
        // TODO: Handle Error when game doesn't exist
        this.game = await Games.GetById(this.props.match.params.id);
        this.stats = await Statistics.GetStats(this.game.difficulty);
        const settings: IPreferences = {
            defaultCellSize: 120,
            gridGapSize: 5,
            spinningCubes: 7,
            simpleRender: false,
            timestamp: new Date(),
        };
        let switchGameTimeToOne = false;
        let winningText = "You win!";
        if (Math.floor(this.game.time) >= this.stats.worstTime) {
            winningText = "New Low Score!";
            if (Math.floor(this.game.time) === 0) {
                switchGameTimeToOne = true;
                this.stats.worstTime = 1;
            } else {
                this.stats.worstTime = Math.floor(this.game.time);
            }
        }
        if (Math.floor(this.game.time) <= this.stats.bestTime || this.stats.bestTime === 0) {
            winningText = "New High Score!";
            if (Math.floor(this.game.time) === 0) {
                switchGameTimeToOne = true;
                this.stats.bestTime = 1;
            } else {
                this.stats.bestTime = Math.floor(this.game.time);
            }
        }
        if (switchGameTimeToOne) {
            this.game.time = 1;
        }
        this.setState({
            loading: false,
            winningText,
            moves: this.game.totalMoves,
            time: this.game.time,
            difficulty: this.game.difficulty,
            lastFrame: 0,
            dimentions: settings.defaultCellSize + 1
        });
        this.canvas = document.getElementById("piece-canvas") as HTMLCanvasElement;
        this.context2D = this.canvas.getContext('2d')!;
        this.pieceRenderer = new BombFinderPieceRenderer(settings);
        requestAnimationFrame(this.draw);
    }

    componentWillUnmount() {
        if (this.game) {
            this.game.logAndDestroy();
        }
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
        const { difficulty, bombs, width, height } = this.game!;
        return (
            <div className="game-won">
                <canvas id="piece-canvas"
                    width={this.state.dimentions}
                    height={this.state.dimentions}>
                    This Device doesn't support the canvas element!
                </canvas>
                <div className="game-won--statement">{this.state.winningText}</div>
                <div className="game-won--statement">{difficulty} ({width}x{height}:{bombs})</div>
                <div className="divider" />
                <ul className="game-won__stats">
                    <li className="game-won__stats__item">Moves <br/>{this.state.moves}</li>
                    <li className="game-won__stats__item">Score <br/>{toHHMMSS(this.state.time!)}</li>
                    <li className="game-won__stats__item--icon"><img src={hourglass} alt="watch" /></li>
                    <li className="game-won__stats__item">Best <br/>{toHHMMSS(this.stats!.bestTime)}</li>
                    <li className="game-won__stats__item">Worst <br/>{toHHMMSS(this.stats!.worstTime)}</li>
                </ul>
                <div className="divider" />
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
        this.context2D!.fillRect(0, 0, this.state.dimentions, this.state.dimentions);
        this.pieceRenderer!.drawPlaceHolder(this.context2D!, 0, 0);
        if (this.keepUpdating) {
            this.setState({
                rafId: requestAnimationFrame(this.draw),
                lastFrame: delta,
            })
        }
    } 
}
