import React, { Component } from 'react';
import BombFinder from "../logic/BombFinder";
import BombFinderRenderer from "../logic/BombFinderRenderer";
import InputController from "../logic/InputController";
import { Link } from 'react-router-dom';
import { GameDifficulty } from '../models/GameTypes';
import Games from '../models/Games';

interface Props {
    id: string;
    difficulty: GameDifficulty;
    width: number;
    height: number;
    bombs: number;
}

interface State {
    lastFrame: number;
    rafId?: number;
    inputId?: number;
    game: BombFinder;
    renderer: BombFinderRenderer;
    input: InputController;
}

class GameBoard extends Component<Props, State> {

    private canvas?: HTMLCanvasElement;
    private context2D?: CanvasRenderingContext2D;

    constructor(props: Props) {
        super(props);
        const games = new Games(props.id, props.difficulty, props.width, props.height, props.bombs, []);
        const gameState = new BombFinder(games);
        this.state = {
            lastFrame: 0,
            rafId: undefined,
            inputId: undefined,
            game: gameState,
            renderer: new BombFinderRenderer(gameState),
            input: new InputController(),
        };
    }

    public componentDidMount() {
        // TODO: Add error handling
        this.canvas = document.getElementById("board") as HTMLCanvasElement;
        this.context2D = this.canvas.getContext("2d")!;
        this.setState({
            inputId: this.state.input.start(this.canvas!, ["mousemove", "mousedown", "contextmenu"])
        });
        this.init();
        this.draw(0);
    }

    public componentWillUnmount() {
        this.state.input.stop(this.state.inputId!);
        window.cancelAnimationFrame(this.state.rafId!);
    }

    public shouldComponentUpdate() {
        return false;
    }

    public tryAgain = () => {
        this.state.game.reset();
    }

    public render() {
        return (
            <div className="board__container">
                <div>Time: {this.state.game.getTime}</div>
                <div>Pieces: {this.state.game.getRemainingAvailablePiece}/{this.state.game.getTotalAvailablePieces}</div>
                <canvas className="board" id="board" />
                {
                    (this.state.game.isGameOver)
                        ?
                        <div>
                            <button onClick={this.tryAgain}>Try Again</button>
                            <Link to="/">Main Menu</Link>
                        </div>
                        : null
                }
            </div>
        );
    }

    private init() {
        this.canvas!.width = this.state.renderer.gameBoardWidth;
        this.canvas!.height = this.state.renderer.gameBoardHeight;
    }

    private draw = (delta: number) => {
        const elapsedTime = delta - this.state.lastFrame;
        this.setState({ lastFrame: delta });
        const events = this.state.input.pollEvents(this.state.inputId!);
        this.state.game.update(elapsedTime);

        if (events !== null) {
            this.state.game.handleEvents(events);
            this.state.renderer.draw(this.context2D!, delta);
            this.forceUpdate();
        }

        // Initial draw call before any events
        if (this.state.rafId === undefined) {
            this.state.renderer.draw(this.context2D!, delta);
        }


        this.state.input.flush();

        if (this.state.game.isGameWon) {
            console.log("game won");
            window.location.pathname = `${window.location.pathname}/game-won`;
            return;
        }

        this.setState({
            rafId: window.requestAnimationFrame(this.draw)
        });
    }
}

export default GameBoard;