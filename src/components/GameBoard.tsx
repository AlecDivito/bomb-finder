import React, { Component } from 'react';
import BombFinder from "../logic/BombFinder";
import InputController from "../logic/InputController";
import { Link, Redirect } from 'react-router-dom';
import { GameProgress } from '../models/GameTypes';
import Games from '../models/Games';
import './GameBoard.css';
import Loading from './Loading';
import Preferences from '../models/Preferences';
import Button from './Button';
import GameHeader from './Gameheader';
import GameFooter from './GameFooter';

interface Props {
    id: string;
    onGameFinished: (result: GameProgress) => void
}

interface State {
    ready: boolean;
    lastFrame: number;
    newGameId?: string;
    rafId?: number;
    inputId?: number;
}

class GameBoard extends Component<Props, State> {

    private stopUpdates: boolean = false;

    private canvas?: HTMLCanvasElement;
    private context2D?: CanvasRenderingContext2D;
    private gameState?: BombFinder;
    private input?: InputController;

    state: Readonly<State> = {
        ready: false,
        lastFrame: 0,
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevState.newGameId && prevProps.id !== prevState.newGameId) {
            // new game has started without unmounting the component
            this.setState({
                ready: false,
                lastFrame: 0,
                newGameId: undefined,
                rafId: undefined,
                inputId: undefined,
            });
            this.destroyGame();
            this.createGame();
        }
    }

    public async componentDidMount() {
        this.createGame();
    }

    public componentWillUnmount() {
        this.stopUpdates = true;
        this.destroyGame();
    }

    

    public async createGame() {
        const games = await Games.GetById(this.props.id);
        const preferences = await Preferences.GetPreferences();
        const page = document.getElementById("page") as HTMLDivElement;
        if (games.result === "won") {
            this.props.onGameFinished(games.result);
            return;
        }
        this.gameState = new BombFinder(games, preferences, page.clientWidth, page.clientHeight - 120);
        this.input = new InputController();
        this.setState({ ready: true });
        this.canvas = document.getElementById("board") as HTMLCanvasElement;
        const container = document.getElementById("board-container") as HTMLDivElement;
        this.context2D = this.canvas.getContext("2d")!;

        const inputId = this.input.start(this.canvas!, ["mousemove", "mousedown",
            "contextmenu", "touchstart", "touchmove", "touchend"]);

        // TODO: Add error handling
        this.canvas!.width = this.gameState!.gameBoardWidth;
        this.canvas!.height = this.gameState!.gameBoardHeight;
        container.scrollLeft = (this.gameState!.gameBoardWidth - window.innerWidth) / 2;
        this.setState({ ready: true, inputId: inputId });
        requestAnimationFrame(this.draw);
    }

    public destroyGame() {
        if (this.state.ready && this.state.inputId) {
            this.input!.stop(this.state.inputId!);
        }
        if (this.state.rafId) {
            cancelAnimationFrame(this.state.rafId!);
        }
    }

    public changeInputMode = (markFlag: boolean) => {
        this.gameState!.setMarkInput(markFlag);
        this.gameState!.draw(this.context2D!);
    }

    public tryAgain = async () => {
        if (this.state.ready && !this.state.newGameId) {
            try {
                const newGameId = await this.gameState!.reset();
                this.setState({ newGameId });
            } catch (e) {
                console.warn("erorr " + e);
                // TODO: implement Error handling
            }
        }
    }

    public render() {
        if (this.state.newGameId) {
            const route = `/game/${this.state.newGameId}`;
            return <Redirect to={route} />;
        }
        if (!this.state.ready) {
            return <Loading />
        }
        const dimensions = {
            height: this.gameState!.gameBoardHeight,
            width: this.gameState!.gameBoardWidth,
        };
        return (
            <div className="board">
                <GameHeader time={this.gameState!.getTime}
                    left={this.gameState!.getRemainingAvailablePiece}
                    pieces={this.gameState!.getTotalAvailablePieces}/>
                <div className="board__canvas" id="board-container">
                    <canvas id="board"
                        className={this.gameState!.gameState}
                        width={dimensions.width}
                        height={dimensions.height} />
                    {(this.gameState!.isGameOver)
                        ? <div className="board__popup">
                            <Button className="board__popup__item"
                                type="button"
                                text="Try Again"
                                onClick={this.tryAgain} />
                            <Link className="board__popup__item link-button" to="/">
                                Main Menu
                            </Link>
                        </div>
                        : null
                    }
                </div>
                <GameFooter flagToggle={this.changeInputMode} />
            </div>
        );
    }

    private draw = (delta: number) => {
        if (!this.state.ready) {
            // TODO: do we need this ready check for the game?????
            return;
        }
        const elapsedTime = delta - this.state.lastFrame;
        const events = this.input!.pollEvents(this.state.inputId!);
        
        if (events) {
            this.gameState!.handleEvents(events);
        }
        this.gameState!.update(elapsedTime);
        this.gameState!.draw(this.context2D!);
        
        // Initial draw call before any events
        if (this.state.rafId === undefined || this.gameState!.isGameOver) {
            this.gameState!.draw(this.context2D!);
        }
        
        this.input!.flush();
        
        
        if (this.gameState!.isGameOver) {
            // cancelAnimationFrame(this.state.rafId!);
            this.setState({ lastFrame: delta });
            if (this.gameState!.isGameWon) {
                this.props.onGameFinished("won");
            }
            // return;
        }

        if (!this.stopUpdates) {
            this.setState({
                rafId: requestAnimationFrame(this.draw),
                lastFrame: delta
            });
        }
    }
}

export default GameBoard;