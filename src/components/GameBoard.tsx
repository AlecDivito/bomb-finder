import React, { Component } from 'react';
import BombFinder from "../logic/BombFinder";
import BombFinderRenderer from "../logic/BombFinderRenderer";
import InputController from "../logic/InputController";
import { Link } from 'react-router-dom';
import { GameDifficulty, GameProgress } from '../models/GameTypes';
import Games from '../models/Games';

interface Props {
    id: string;
    onGameFinished: (result: GameProgress) => void
}

interface State {
    ready: boolean;
    pushUpdate: boolean;
    lastFrame: number;
    rafId?: number;
    inputId?: number;
}

class GameBoard extends Component<Props, State> {

    private canvas?: HTMLCanvasElement;
    private context2D?: CanvasRenderingContext2D;
    private gameState?: BombFinder;
    private renderer?: BombFinderRenderer;
    private input?: InputController;

    state: Readonly<State> = {
        ready: false,
        pushUpdate: false,
        lastFrame: 0,
        rafId: undefined,
        inputId: undefined,
    }

    public async componentDidMount() {
        // create data
        const games = await Games.GetGame(this.props.id);
        console.log(games);
        this.gameState = new BombFinder(games);
        this.renderer = new BombFinderRenderer(this.gameState);
        this.input = new InputController();
        this.setState({ ready: true });

        // TODO: Add error handling
        this.canvas = document.getElementById("board") as HTMLCanvasElement;
        this.context2D = this.canvas.getContext("2d")!;
        this.setState({
            inputId: this.input.start(this.canvas!, ["mousemove", "mousedown", "contextmenu"])
        });
        this.init();
        this.draw(0);
    }

    public componentWillUnmount() {
        if (this.state.ready) {
            this.input!.stop(this.state.inputId!);
        }
        if (this.state.rafId) {
            window.cancelAnimationFrame(this.state.rafId!);
        }
    }

    public shouldComponentUpdate() {
        if (this.state.pushUpdate) {
            this.setState({ pushUpdate: false });
            return true;
        }
        return false;
    }

    public tryAgain = () => {
        if (this.state.ready) {
            this.gameState!.reset();
        }
    }

    public render() {
        return (
            <div className="board__container">
                {
                    (this.state.ready)
                    ? <div>
                        <div>Time: {this.gameState!.getTime}</div>
                        <div>Pieces: {this.gameState!.getRemainingAvailablePiece}/{this.gameState!.getTotalAvailablePieces}</div>
                    </div>
                    : <div></div>
                }
                <canvas className="board" id="board" />
                {
                    (this.state.ready && this.gameState!.isGameOver)
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
        if (this.state.ready) {
            this.canvas!.width = this.renderer!.gameBoardWidth;
            this.canvas!.height = this.renderer!.gameBoardHeight;
        }
    }

    private draw = (delta: number) => {
        if (!this.state.ready) {
            // TODO: do we need this ready check for the game?????
            return;
        }
        const elapsedTime = delta - this.state.lastFrame;
        const events = this.input!.pollEvents(this.state.inputId!);
        const pushUpdate = this.gameState!.update(elapsedTime);

        if (this.gameState!.isGameOver) {
            window.cancelAnimationFrame(this.state.rafId!);
            return;
        }

        if (events !== null) {
            this.gameState!.handleEvents(events);
            this.renderer!.draw(this.context2D!, delta);
        }

        // Initial draw call before any events
        if (this.state.rafId === undefined) {
            this.renderer!.draw(this.context2D!, delta);
        }


        this.input!.flush();

        if (this.gameState!.isGameWon) {
            this.props.onGameFinished("won")
            return;
        }

        this.setState({
            pushUpdate: pushUpdate,
            rafId: window.requestAnimationFrame(this.draw),
            lastFrame: delta
        });
    }
}

export default GameBoard;