import React, { Component } from 'react';
import BombFinder from "../logic/BombFinder";
import BombFinderRenderer from "../logic/BombFinderRenderer";
import InputController from "../logic/InputController";
import { Link, Redirect } from 'react-router-dom';
import { GameProgress } from '../models/GameTypes';
import Games from '../models/Games';
import { string } from 'prop-types';
import uuid from '../util/uuid';

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

    private canvas?: HTMLCanvasElement;
    private context2D?: CanvasRenderingContext2D;
    private gameState?: BombFinder;
    private renderer?: BombFinderRenderer;
    private input?: InputController;

    state: Readonly<State> = {
        ready: false,
        lastFrame: 0,
        newGameId: undefined,
        rafId: undefined,
        inputId: undefined,
    }

    public componentWillUpdate() {
        if (this.state.newGameId) {
            return false;
        }
        return true;
    }

    public componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
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
        console.log('mounting');
        this.createGame();
    }

    public componentWillUnmount() {
        console.log("unmount")
        this.destroyGame();
    }

    public async createGame() {
        const games = await Games.GetGame(this.props.id);
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

    public destroyGame() {
        if (this.state.ready) {
            this.input!.stop(this.state.inputId!);
        }
        if (this.state.rafId) {
            window.cancelAnimationFrame(this.state.rafId!);
        }
    }

    public tryAgain = async () => {
        if (this.state.ready && !this.state.newGameId) {
            const newGameId = uuid();
            await this.gameState!.reset(newGameId);
            this.setState({ newGameId });
        }
    }

    public render() {
        if (this.state.newGameId) {
            const route = `/game/${this.state.newGameId}`;
            return <Redirect to={route} />;
        }
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
        this.gameState!.update(elapsedTime);
        
        if (events.mouse || events.mouseButton) {
            this.gameState!.handleEvents(events);
            this.renderer!.draw(this.context2D!, delta);
        }
        
        // Initial draw call before any events
        if (this.state.rafId === undefined || this.gameState!.isGameOver) {
            this.renderer!.draw(this.context2D!, delta);
        }
        
        this.input!.flush();
        
        if (this.gameState!.isGameWon) {
            this.props.onGameFinished("won")
        }

        if (this.gameState!.isGameOver) {
            window.cancelAnimationFrame(this.state.rafId!);
            this.setState({ lastFrame: delta });
            return;
        }

        this.setState({
            rafId: window.requestAnimationFrame(this.draw),
            lastFrame: delta
        });
    }
}

export default GameBoard;