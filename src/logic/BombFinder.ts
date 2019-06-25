import { Cell, CellState, CellValue, Visibility, isVisible, isBomb } from "../models/GameBoardTypes";
import { SimpleEventState } from "../models/EventTypes";
import InSquare from "../util/InSquare";
import { Point2d, InputMode } from "../models/GameTypes";
import Games from "../models/Games";
import { IPreferences } from "../models/Preferences";
import AnimationTimer, { LoopOptions } from "./Animation";
import BombFinderPieceRenderer from "./BombFinderPieceRenderer";

const ROTATING_PIECES = 7;

export default class BombFinder {

    // template data
    private games: Games;
    private settings: IPreferences;
    private pieceRenderer: BombFinderPieceRenderer;

    // game play
    private grid: Cell[] = [];
    private updateRemainingPiecesCount: boolean = false;
    private remainingPieces: number = 0;
    private inputMode: InputMode = InputMode.TOGGLE;

    // animations
    private readonly backgroundAnimation: AnimationTimer;
    private readonly pieceAnimations: AnimationTimer[] = [];

    // canvas data
    private readonly height: number;
    private readonly width: number;
    private readonly offsetWidth: number;
    private readonly offsetHeight: number;

    constructor(games: Games, settings: IPreferences, minWidth: number, minHeight: number) {
        this.games = games;
        this.settings = settings;
        this.pieceRenderer = new BombFinderPieceRenderer(
            this.settings.defaultCellSize, this.settings.gridGapSize, ROTATING_PIECES
        );

        const calculatedWidth = this.calculateBoardSize(this.games.width);
        const calculatedHeight = this.calculateBoardSize(this.games.height);

        if (minWidth > calculatedWidth) {
            this.width = minWidth;
            this.offsetWidth = (this.width - calculatedWidth) / 2;;
        } else {
            this.width = calculatedWidth;
            this.offsetWidth = 0;
        }

        if (minHeight > calculatedHeight) {
            this.height = minHeight;
            this.offsetHeight = (this.height - calculatedHeight) / 2;
        } else {
            this.height = calculatedHeight;
            this.offsetHeight = 0;
        }
        for (let i = ROTATING_PIECES + 1; i >= 1; i--) {
            this.pieceAnimations.push(
                new AnimationTimer(90 * i, Math.pow(i + 1, i * .05) - 1, LoopOptions.ALTERNATE));
        }
        this.backgroundAnimation = new AnimationTimer(121, 3);            
        this.setMarkInput();

        this.init();
    }

    public get gameBoardWidth() {
        return this.width;
    }

    public get gameBoardHeight() {
        return this.height;
    }

    public get gameState() {
        return this.games.result;
    }

    public get isGameOver() {
        return this.games.result === "lost" || this.games.result === "won";
    }

    public get isGameWon() {
        return this.games.result === "won";
    }

    public get getRemainingAvailablePiece() {
        return this.remainingPieces;
    }

    public get getTime() {
        return Math.floor(this.games.time);
    }

    public setMarkInput(markFlag: boolean = false) {
        this.inputMode = (markFlag) ? InputMode.MARK : InputMode.TOGGLE;
        if (this.inputMode === InputMode.MARK) {
            this.backgroundAnimation.setTarget(121);
            this.backgroundAnimation.setStep(3);
            this.backgroundAnimation.play();
        } else if (this.inputMode === InputMode.TOGGLE) {
            this.backgroundAnimation.setTarget(0);
            this.backgroundAnimation.setStep(-3);
            this.backgroundAnimation.play();
        }
    }

    public async reset(): Promise<string> {
        const newGame = await this.games.reset(this.games);
        if (newGame) {
            return newGame.id;
        }
        throw new Error("Had a problem saving old Game");
    }

    public update(delta: number) {
        this.pieceRenderer.update(delta);
        this.backgroundAnimation.update(delta);
        for (let i = 0; i < ROTATING_PIECES; i++) {
            this.pieceAnimations[i].update(delta);
        }
        if (this.games.gameHasStarted) {
            const calcDelta = delta / 1000;
            this.games.time += calcDelta;
        }
        if (this.updateRemainingPiecesCount) {
            let counter = this.games.totalPieces;
            this.grid.forEach((cell) =>
                (isVisible(cell.visibility) && !isBomb(cell.value))
                    ? counter--
                    : counter
            );
            this.remainingPieces = counter;
            this.updateRemainingPiecesCount = false;
            this.games.invisiblePieces = this.getRemainingAvailablePiece;
            this.games.totalMoves++;
            this.games.update();
        }
        if (this.games.result === "lost" || this.remainingPieces === 0) {
            this.grid.forEach((cell) => {
                if (cell.state === CellState.BOMB) {
                    cell.visibility = Visibility.VISIBLE
                }
            });
            this.games.board = this.grid;
            this.games.isComplete = true;
            this.games.finishedAt = new Date();
        }
        if (this.games.result === "lost") {
            this.games.result = "lost";
            this.games.logAndDestroy();
        }
        else if (this.remainingPieces === 0) {
            this.games.result = "won";
            this.games.logAndDestroy();
        }
    }

    public handleEvents(events?: SimpleEventState) {
        if (this.games.result !== "inprogress" && this.games.result !== "created") {
            return;
        }
        if (!events) {
            return;
        }
        if (events.events.includes("mousemove")) {
            this.grid.forEach((cell) => {
                cell.hover = false;
            });
            const index = this.getIndexByPixel(events.pos);
            if (index !== null && index < this.grid.length && this.grid[index]) {
                this.grid[index].hover = true;
            }
        }
        if (events.events.includes("mousedown") || events.events.includes("touch")) {
            this.games.result = "inprogress";
            const index = this.getIndexByPixel(events.pos);
            if (index === null || index >= this.grid.length) {
                return;
            }
            const cell = this.grid[index];
            if (this.inputMode === InputMode.TOGGLE && events.leftClick && cell.visibility === Visibility.INVISIBLE) {
                if (isBomb(cell.value)) {
                    this.games.result = "lost";
                }
                if (cell.value === 0) {
                    this.toggleCell(index);
                }
                this.setCellVisibility(index);
            } else if (events.rightClick || (events.leftClick && this.inputMode === InputMode.MARK)) {
                cell.visibility = (cell.visibility === Visibility.MARKED)
                ? Visibility.INVISIBLE
                : Visibility.MARKED;
                this.markCell(index);
            }
            this.updateRemainingPiecesCount = true;
        }
        if (this.games.result === "lost") {
            this.grid.forEach((cell) => {
                if (isBomb(cell.value)) {
                    cell.visibility = Visibility.VISIBLE
                }
            });
        }
    }

    protected init() {
        this.remainingPieces = this.games.totalPieces;
        if (this.games.board.length === 0) {
            this.grid = this.constructGrid();
            this.games.board = this.grid;
        }
        else {
            this.grid = this.games.board;
        }
    }

    private toggleCell(index: number) {
        const neighbors = this.getNeighbors(index);
        const visited: number[] = [index];
        while (neighbors.length > 0) {
            const i = neighbors.pop()!;
            if (this.grid[i].value === 0) {
                const newNeighbors = this.getNeighbors(i);
                newNeighbors.forEach((newIndex) => {
                    if (!neighbors.includes(newIndex) && !visited.includes(newIndex)) {
                        neighbors.push(newIndex);
                    }
                });
            }
            this.setCellVisibility(i);
            visited.push(i);
        }
    }

    private markCell(index: number) {
        const neighbors = this.getNeighbors(index);
        neighbors.forEach((neighbor) => {
            const cell = this.grid[neighbor];
            if (isVisible(cell.visibility) && !isBomb(cell.value) && cell.value !== 0) {
                this.setCellVisibility(neighbor);
            }
        });
    }

    private setCellVisibility(index: number) {
        if (this.grid[index].value === null || this.grid[index].value === 0) {
            this.grid[index].visibility = Visibility.VISIBLE;
            return;
        }
        const neighbor = this.getNeighbors(index);
        const count = neighbor.reduce((pre, index) => {
            const cell = this.grid[index];
            if (cell.state === CellState.BOMB && cell.visibility === Visibility.MARKED) {
                return pre + 1;
            }
            return pre;
        }, 0);
        if (count >= this.grid[index].value!) {
            this.grid[index].visibility = Visibility.VISIBLY_SATISFIED
        } else {
            this.grid[index].visibility = Visibility.VISIBLE;
        }
    }

    private getIndexByPixel(point: Point2d): number | null {
        const cellSize = this.settings.gridGapSize + this.settings.defaultCellSize;
        const row = Math.floor((point.y - this.offsetHeight) / cellSize);
        const col = Math.floor((point.x - this.offsetWidth) / cellSize);

        // check if pointer is inside square
        const top =  this.offsetHeight + ((row * cellSize) + this.settings.gridGapSize);
        const left = this.offsetWidth + ((col * cellSize) + this.settings.gridGapSize);

        if (row >= 0 && col >= 0 && row < this.games.width && col < this.games.height &&
            InSquare({top, left, size: this.settings.defaultCellSize }, point)) {
            return this.getIndex(row, col);
        }
        return null;
    }

    private getIndex(row: number, col: number): number {
        return (row * this.games.width) + col;
    }

    private constructGrid(): Cell[] {
        const grid: Array<Cell | null> = [];

        // create the grid
        for (let i = 0; i < this.games.area; i++) {
            grid.push(null);
        }

        // place the bombs
        let bombCounter = this.games.bombs;
        while (bombCounter > 0) {
            const defaultCell: Cell = {
                hover: false,
                visibility: Visibility.INVISIBLE,
                state: CellState.BOMB,
            }
            const index = Math.floor(Math.random() * this.games.area);

            if (grid[index] === null) {
                bombCounter--;
                grid[index] = defaultCell;
            }
        }

        // place safe spaces
        for (let index = 0; index < grid.length; index++) {
            if (grid[index] !== null) { // if this is a bomb
                continue;
            }

            let bombProximityCounter = 0;
            const neighbors = this.getNeighbors(index);
            for (let i = 0; i < neighbors.length; i++) {
                const neighborIndex = neighbors[i];
                if (grid[neighborIndex] !== null && grid[neighborIndex]!.state === CellState.BOMB) {
                    bombProximityCounter++;
                }
            }
            const cell: Cell = {
                hover: false,
                visibility: Visibility.INVISIBLE,
                state: CellState.CLEAN,
                value: bombProximityCounter as CellValue,
            };
            grid[index] = cell;
        }

        return grid as Cell[];
    }

    private getNeighbors(index: number): number[] {
        if (index < 0 || index >= this.games.area) {
            return [];
        }
        const row = Math.floor(index / this.games.width);
        const col = index % this.games.width;
        const neighbors = [];
        for (let j = 0; j < 8; j++) {
            let tempRow = row;
            let tempCol = col;
            switch (j) {
                case 0:
                    tempRow -= 1;
                    tempCol -= 1;
                    break;
                case 1: tempRow -= 1; break;
                case 2:
                    tempRow -= 1;
                    tempCol += 1;
                    break;
                case 3: tempCol -= 1; break;
                case 4: tempCol += 1; break;
                case 5:
                    tempRow += 1;
                    tempCol -= 1;
                    break;
                case 6: tempRow += 1; break;
                case 7:
                    tempRow += 1;
                    tempCol += 1;
                    break;
            }
            const tempIndex = this.getIndex(tempRow, tempCol);
            if (tempRow >= 0 && tempRow < this.games.height && // check if the index is in the gird
                tempCol >= 0 && tempCol < this.games.width) {
                neighbors.push(tempIndex);
            }
        }
        
        return neighbors;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.drawBackground(ctx);
        this.drawBoard(ctx);
    }

    private drawBackground(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const gradient1 = ctx.createLinearGradient(this.width / 2,
            this.height, this.width / 2, 0);
        gradient1.addColorStop(0.05, '#333');
        gradient1.addColorStop(1, `hsla(${360 - this.backgroundAnimation.getValue()}, 100%, 50%, 1)`);
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
    }

    private drawBoard(ctx: CanvasRenderingContext2D) {
        ctx.save();
        this.grid.forEach((cell, index) => {
            const row = Math.floor(index / this.games.width);
            const col = index % this.games.width;

            // position
            const x = this.offsetWidth + this.calculateBoardSize(col);
            const y = this.offsetHeight + this.calculateBoardSize(row);

            /**
             * This is what I want to be able to call
             */
            this.pieceRenderer.drawPiece(ctx, cell, x, y);
        });
        ctx.restore();
    }

    private calculateBoardSize(size: number) {
        return (size * this.settings.defaultCellSize) + ((size + 1) * this.settings.gridGapSize)
    }
}
