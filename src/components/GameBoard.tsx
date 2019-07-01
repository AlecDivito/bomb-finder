import React, { Component } from 'react';
import BombFinder from "../logic/BombFinder";
import InputController from "../logic/InputController";
import { Redirect } from 'react-router-dom';
import { GameProgress } from '../models/GameTypes';
import { CanvasWindow } from '../logic/BombFinderPieceRenderer';
import Games from '../models/Games';
import Loading from './Loading';
import Preferences from '../models/Preferences';
import Button from './Button';
import GameHeader from './Gameheader';
import GameFooter from './GameFooter';
import './GameBoard.css';

interface Props {
    id: string;
    onGameFinished: (result: GameProgress) => void
}

interface State {
    ready: boolean;
    gameOver: boolean;
    canVibrate: boolean;
    canTryAgain: boolean;
    toMainMenu: boolean;
    totalPieces: number;
    newGameId?: string;
    inputId?: number;
    time: number;
}

class GameBoard extends Component<Props, State> {

    private stopUpdates: boolean = false;
    private rafId?: number;
    private lastFrame: number = 0;

    private container?: HTMLDivElement;
    private canvas?: HTMLCanvasElement;
    // TODO: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#Turn_off_transparency
    private context2D?: CanvasRenderingContext2D;
    private gameState?: BombFinder;
    private input?: InputController;

    state: Readonly<State> = {
        ready: false,
        gameOver: false,
        canVibrate: false,
        canTryAgain: false,
        toMainMenu: false,
        totalPieces: 0,
        time: 0,
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevState.newGameId && prevProps.id !== prevState.newGameId) {
            // new game has started without unmounting the component
            this.setState({
                ready: false,
                gameOver: false,
                canTryAgain: false,
                time: 0,
                newGameId: undefined,
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
        // TODO: GetById error handling
        const games = await Games.GetById(this.props.id)!;
        const preferences = await Preferences.GetPreferences();
        const page = document.getElementById("page") as HTMLDivElement;
        if (games.result === "won") {
            this.props.onGameFinished(games.result);
            return;
        }
        // TODO: Remove magic number
        this.gameState = new BombFinder(games, preferences, page.clientWidth, page.clientHeight - 120);
        this.input = new InputController();
        this.setState({ ready: true, totalPieces: games.totalPieces });
        this.canvas = document.getElementById("board") as HTMLCanvasElement;
        this.container = document.getElementById("board-container") as HTMLDivElement;
        this.context2D = this.canvas.getContext("2d")!;

        const inputId = this.input.start(this.canvas!, ["mousemove", "mousedown",
            "contextmenu", "touchstart", "touchmove", "touchend", "keydown"]);

        // TODO: Add error handling
        this.canvas!.width = this.gameState!.gameBoardWidth;
        this.canvas!.height = this.gameState!.gameBoardHeight;
        this.container.scrollLeft = (this.gameState!.gameBoardWidth - window.innerWidth) / 2;
        this.setState({ ready: true, inputId: inputId, canVibrate: preferences.vibration });
        requestAnimationFrame(this.draw);
    }

    public destroyGame() {
        if (this.state.ready && this.state.inputId) {
            this.input!.stop(this.state.inputId!);
        }
        if (this.rafId) {
            cancelAnimationFrame(this.rafId!);
        }
    }

    public changeInputMode = (markFlag: boolean) => {
        this.gameState!.setMarkInput(markFlag);
        // this.gameState!.draw(this.context2D!);
    }

    public tryAgain = async () => {
        if (this.state.ready && !this.state.newGameId && this.state.canTryAgain) {
            try {
                const newGameId = await this.gameState!.reset();
                this.setState({ ready: false, newGameId });
            } catch (e) {
                console.warn("error " + e);
                // TODO: implement Error handling
            }
        }
    }

    public goToMainMenu = async () => {
        if (this.state.ready) {
            const logged = await this.gameState!.logAndDestory();
            if (logged) {
                this.setState({toMainMenu: true});
            }
        }
    }

    public render() {
        if (this.state.toMainMenu) {
            return <Redirect to="/" />;
        }
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
        let canvasBoardClass = "board__canvas " + this.gameState!.gameBoardOverflowClasses;
        return (
            <div className="board">
                <GameHeader time={this.gameState!.getTime}
                    left={this.gameState!.getRemainingAvailablePiece}
                    pieces={this.state.totalPieces}/>
                <div className={canvasBoardClass} id="board-container">
                    <canvas id="board"
                        className={this.gameState!.gameState}
                        width={dimensions.width}
                        height={dimensions.height} />
                    {(this.state.gameOver)
                        ? <div className="board__popup">
                            <Button className="board__popup__item"
                                type="button"
                                text="Try Again"
                                onClick={this.tryAgain} />
                            <Button className="board__popup__item"
                                type="button"
                                text="Main Menu"
                                onClick={this.goToMainMenu} />
                        </div>
                        : null
                    }
                </div>
                <GameFooter
                    isSwitchChecked={!this.gameState!.isInputModeToggle}
                    flagToggle={this.changeInputMode} />
            </div>
        );
    }

    private draw = (delta: number) => {
        if (!this.state.ready) {
            // TODO: do we need this ready check for the game?????
            return;
        }
        const elapsedTime = delta - this.lastFrame;
        const events = this.input!.pollEvents(this.state.inputId!);
        
        if (events) {
            this.gameState!.handleEvents(events);
            if (events.keys.length > 0) {
                this.forceUpdate();
            }
        }
        this.gameState!.update(elapsedTime);
        // TODO: calcuate playing area and send it to draw
        const viewport: CanvasWindow = {
            x: this.container!.scrollLeft, y: this.container!.scrollTop,
            width: this.container!.clientWidth, height: this.container!.clientHeight
        };
        this.gameState!.draw(this.context2D!, viewport);
        
        // Initial draw call before any events
        if (this.rafId === undefined || this.gameState!.isGameOver) {
            this.gameState!.draw(this.context2D!, viewport);
        }
        
        this.input!.flush();
        
        
        if (this.gameState!.isGameOver) {
            this.lastFrame = delta;
            if (this.gameState!.isGameWon) {
                this.props.onGameFinished("won");
            } else {
                if (this.state.canVibrate && navigator.vibrate) {
                    navigator.vibrate(200);
                }
                this.setState({
                    gameOver: true,
                    canVibrate: false,
                    canTryAgain: true,
                });
            }
        }

        if (!this.stopUpdates) {
            this.rafId = requestAnimationFrame(this.draw);
            this.lastFrame = delta;
            if (this.state.time !== this.gameState!.getTime) {
                this.setState({ time: this.gameState!.getTime });
            }
        }
    }
}

export default GameBoard;