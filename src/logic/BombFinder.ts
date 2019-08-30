import { Cell, CellState, CellValue, Visibility, isVisible, isBomb, isMarkable, isMarked, incrementCellValue, decrementCellValue } from "../models/GameBoardTypes";
import { SimpleEventState } from "../models/EventTypes";
import InSquare from "../util/InSquare";
import { Point2d, InputMode } from "../models/GameTypes";
import Games from "../models/Games";
import { IPreferences } from "../models/Preferences";
import AnimationTimer from "./Animation";
import BombFinderPieceRenderer, { CanvasWindow } from "./BombFinderPieceRenderer";
import RandInRange from "../util/Random";

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

    // canvas data
    private readonly height: number;
    private readonly width: number;
    private readonly offsetWidth: number;
    private readonly offsetHeight: number;
    private readonly overflowClasses: string = "";

    constructor(games: Games, settings: IPreferences, minWidth: number, minHeight: number) {
        this.games = games;
        this.settings = settings;
        this.pieceRenderer = new BombFinderPieceRenderer(settings);

        const calculatedWidth = this.calculateBoardSize(this.games.width);
        const calculatedHeight = this.calculateBoardSize(this.games.height);

        if (minWidth > calculatedWidth) {
            this.width = minWidth;
            this.offsetWidth = (this.width - calculatedWidth) / 2;;
        } else {
            this.overflowClasses += " overflow-x"; 
            this.width = calculatedWidth;
            this.offsetWidth = 0;
        }

        if (minHeight > calculatedHeight) {
            this.height = minHeight;
            this.offsetHeight = (this.height - calculatedHeight) / 2;
        } else {
            this.overflowClasses += " overflow-y"; 
            this.height = calculatedHeight;
            this.offsetHeight = 0;
        }
        this.backgroundAnimation = new AnimationTimer(121, 3);            
        this.setMarkInput();

        this.init();
    }

    public get isInputModeToggle() {
        return InputMode.TOGGLE === this.inputMode;
    }

    public get gameBoardOverflowClasses() {
        return this.overflowClasses;
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

    public async logAndDestroy() {
        return await this.games.logAndDestroy();
    }

    public update(delta: number) {
        if (this.games.isComplete) {
            return;
        }
        this.pieceRenderer.update(delta);
        this.backgroundAnimation.update(delta);
        if (this.games.gameHasStarted && this.remainingPieces !== this.games.totalPieces) {
            const calcDelta = delta;
            this.games.time += calcDelta;
        }
        if (this.updateRemainingPiecesCount) {
            this.remainingPieces = this.grid.reduce((total, cell) =>
                (isVisible(cell.visibility) && !isBomb(cell.value)) ? total - 1 : total
            , this.games.totalPieces);
            this.updateRemainingPiecesCount = false;
            this.games.invisiblePieces = this.remainingPieces;
            this.games.update();
        }
        if (!this.games.isComplete && (this.games.result === "lost" || this.remainingPieces === 0)) {
            this.grid.forEach((cell) => {
                if (cell.state === CellState.BOMB) {
                    cell.visibility = Visibility.VISIBLE
                }
            });
            this.games.board = this.grid;
            if (this.games.result === "lost") {
                this.games.result = "lost";
                this.games.update();
            }
            else if (this.remainingPieces === 0) {
                this.games.result = "won";
                this.games.update();
            }
            this.games.isComplete = true;
        }
    }

    public handleEvents(events?: SimpleEventState) {
        if (this.games.result !== "inprogress" && this.games.result !== "created") {
            return;
        }
        if (!events) {
            return;
        }
        if (events.events.includes("dblclick") || (events.events.includes("keydown") && events.keys.includes("f"))) {
            this.setMarkInput(this.inputMode === InputMode.TOGGLE);
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
            let cell = this.grid[index];
            if (this.inputMode === InputMode.TOGGLE && events.leftClick && cell.visibility === Visibility.INVISIBLE) {
                this.games.totalMoves++;
                if (isBomb(cell.value) && this.remainingPieces === this.games.totalPieces
                    && this.settings.firstMoveHandicap) {
                    // it is impossible to lose on the first move, so move the
                    // bomb somewhere else
                    this.repositionBombCell(index);
                    cell = this.grid[index];
                } else if (isBomb(cell.value)) {
                    this.games.result = "lost";
                }
                if (cell.value === 0) {
                    this.toggleCell(index);
                }
                this.setCellVisibility(index);
            } else if (events.rightClick || (events.leftClick && this.inputMode === InputMode.MARK)) {
                this.games.totalMoves++;
                if (isMarkable(cell.visibility)) {
                    cell.visibility = (cell.visibility === Visibility.MARKED)
                        ? Visibility.INVISIBLE
                        : Visibility.MARKED;
                    this.markCell(index);
                }
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

    /**
     * Bomb was clicked on the first turn, therefore we need to re-position the
     * bomb and calculate the index pieces value
     *
     * @param index position of cell inside grid
     */
    private repositionBombCell(index: number) {
        // reposition bomb
        // check the density of bombs on the board. if the board is too dense
        // place the new bomb at the first non-bomb tile
        let newIndex = 0;
        if ((this.games.bombs / this.games.area) > 0.75) {
            while (isBomb(this.grid[newIndex].value)) { newIndex++; }
        } else {
            do {
                newIndex = RandInRange(0, this.grid.length - 1);
            // we don't need to check if the piece is already visible because
            // no pieces on the board are currently visible
            } while (isBomb(this.grid[newIndex].value));
        }
        this.grid[newIndex] = {
            hover: false,
            visibility: Visibility.INVISIBLE,
            state: CellState.BOMB,
            value: null
        };
        const neighbors = this.getNeighbors(newIndex);
        // update all the neighbors that are not bombs
        neighbors.forEach( cellIndex => {
            if (isBomb(this.grid[cellIndex].value)) {
                return;
            }
            this.grid[cellIndex] = {
                ...this.grid[cellIndex],
                ...{ value: incrementCellValue(this.grid[cellIndex].value)}
            };
        });
        // create the new cell
        const pieces = this.getNeighbors(index);
        const bombs = pieces.reduce((bombs, index) =>
            isBomb(this.grid[index].value) ? bombs + 1 : bombs
        , 0);
        this.grid[index] = {
            hover: false,
            visibility: Visibility.INVISIBLE,
            state: CellState.CLEAN,
            value: bombs as CellValue
        };
        // we also need to decrement all of the neighbors
        pieces.forEach( cellIndex => {
            if (isBomb(this.grid[cellIndex].value)) {
                return;
            }
            this.grid[cellIndex] = {
                ...this.grid[cellIndex],
                ...{ value: decrementCellValue(this.grid[cellIndex].value) }
            }
        });
    }

    protected init() {
        this.remainingPieces = this.games.invisiblePieces;
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
            if (this.grid[i].value === 0 && !isMarked(this.grid[i])) {
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
        if (isMarked(this.grid[index])) {
            return;
        }
        if (this.grid[index].value === null || this.grid[index].value === 0) {
            this.grid[index].visibility = Visibility.VISIBLE;
            return;
        }
        const neighbor = this.getNeighbors(index);
        const count = neighbor.reduce((pre, index) => {
            const cell = this.grid[index];
            if (cell.visibility === Visibility.MARKED) {
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

        if (row >= 0 && col >= 0 && col < this.games.width && row < this.games.height &&
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

    public draw(ctx: CanvasRenderingContext2D, canvasWindow: CanvasWindow) {
        this.drawBackground(ctx);
        this.drawBoard(ctx, canvasWindow);
    }

    private drawBackground(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const gradient1 = ctx.createLinearGradient(this.width / 2,
            this.height, this.width / 2, 0);
        gradient1.addColorStop(0.05, '#333');
        if (this.settings.vibrantColors) {
            gradient1.addColorStop(1, `hsla(${360 - this.backgroundAnimation.getValue()}, 100%, 50%, 1)`);
        } else {
            gradient1.addColorStop(1, `hsla(${360 - this.backgroundAnimation.getValue()}, 100%, 64%, .8)`);
        }
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
    }

    private drawBoard(ctx: CanvasRenderingContext2D, canvasWindow: CanvasWindow) {
        const totalPieceSize = this.settings.defaultCellSize + this.settings.gridGapSize;
        const startingColOffset = Math.max(this.width, canvasWindow.width) - canvasWindow.width;
        const startingRowOffset = Math.max(this.height, canvasWindow.height) - canvasWindow.height;

        const startingRow = Math.floor(canvasWindow.x / (totalPieceSize + startingColOffset + 1));
        const startingCol = Math.floor(canvasWindow.y / (totalPieceSize + startingRowOffset + 1));

        const endingCol = Math.min(Math.ceil(
            (canvasWindow.x + canvasWindow.width - this.offsetWidth) / totalPieceSize) + 1,
            this.games.width);
        const endingRow = Math.min(Math.ceil(
            (canvasWindow.y + canvasWindow.height - this.offsetHeight) / totalPieceSize) + 1,
            this.games.height);

        for (let row = startingRow; row < endingRow; row++) {
            for (let col = startingCol; col < endingCol; col++) {
                // position
                const x = this.offsetWidth + this.calculateBoardSize(col);
                const y = this.offsetHeight + this.calculateBoardSize(row);
                const index = this.getIndex(row, col);
                const cell = this.grid[index];
                this.pieceRenderer.drawPiece(ctx, cell, x, y);
            }
        }
    }

    private calculateBoardSize(size: number) {
        return (size * this.settings.defaultCellSize) + ((size + 1) * this.settings.gridGapSize)
    }
}
