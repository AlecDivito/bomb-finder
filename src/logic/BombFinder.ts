import { Cell, CellState, CellValue, Visibility, isVisible, isBomb } from "../models/GameBoardTypes";
import { SimpleEventState } from "../models/EventTypes";
import InSquare from "../util/InSquare";
import { Point2d, InputMode } from "../models/GameTypes";
import Games from "../models/Games";
import { IPreferences } from "../models/Preferences";
import AnimationTimer from "./Animation";

export default class BombFinder {

    // template data
    private games: Games;
    private settings: IPreferences;

    // game play
    private grid: Cell[] = [];
    private updateRemainingPiecesCount: boolean = false;
    private remainingPieces: number = 0;
    private inputMode: InputMode = InputMode.TOGGLE;

    // animations
    private backgroundAnimation: AnimationTimer;

    // canvas data
    private readonly height: number;
    private readonly width: number;
    private readonly offsetWidth: number;
    private readonly offsetHeight: number;

    private get area(): number {
        return this.games.width * this.games.height;
    }

    constructor(games: Games, settings: IPreferences, minWidth: number, minHeight: number) {
        this.games = games;
        this.settings = settings;

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
        this.backgroundAnimation = new AnimationTimer(0, (delta) => delta * 10, (t, d) => t > d);            
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

    public get getTotalAvailablePieces() {
        return this.area - this.games.bombs;
    }

    public get getTime() {
        return Math.floor(this.games.time);
    }

    public setMarkInput(markFlag: boolean = false) {
        this.inputMode = (markFlag) ? InputMode.MARK : InputMode.TOGGLE;
        if (this.inputMode === InputMode.MARK) {
            this.backgroundAnimation.setTarget(this.height);
            this.backgroundAnimation.setCallback((d) => d * 10);
            this.backgroundAnimation.setIsComplete((t, d) => t > d);
        } else if (this.inputMode === InputMode.TOGGLE) {
            this.backgroundAnimation.setTarget(0);
            this.backgroundAnimation.setCallback((d) => -d * 10);
            this.backgroundAnimation.setIsComplete((t, d) => t < d);
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
        this.backgroundAnimation.update(delta);
        if (this.games.gameHasStarted) {
            const calcDelta = delta / 1000;
            this.games.time += calcDelta;
        }
        if (this.updateRemainingPiecesCount) {
            let counter = this.getTotalAvailablePieces;
            this.grid.forEach((cell) =>
                (isVisible(cell.visibility)) ? counter-- : counter
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
                console.log(cell.value);
                if (isBomb(cell.value)) {
                    this.games.result = "lost";
                    console.log(this.games.result);
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
        this.remainingPieces = this.getTotalAvailablePieces;
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
        for (let i = 0; i < this.area; i++) {
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
            const index = Math.floor(Math.random() * this.area);

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
        if (index < 0 || index >= this.area) {
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
        this.drawBoard(ctx)
    }

    private drawBackground(ctx: CanvasRenderingContext2D) {
        ctx.save();
        if (this.inputMode === InputMode.TOGGLE) {
            const gradient = ctx.createLinearGradient(this.width / 2, this.height, this.width / 2, 0);
            gradient.addColorStop(0, '#333');
            gradient.addColorStop(1, 'red');
            ctx.fillStyle = gradient;
            const height = this.height - this.backgroundAnimation.getValue();
            ctx.fillRect(0, 0, this.width, height);
        } else {
            const gradient = ctx.createLinearGradient(this.width / 2, this.height, this.width / 2, 0);
            gradient.addColorStop(0, '#333');
            gradient.addColorStop(1, 'blue');
            ctx.fillStyle = gradient;
            const y = this.height - this.backgroundAnimation.getValue();
            ctx.fillRect(0, y, this.width, this.backgroundAnimation.getValue());
        }
        ctx.restore();
    }

    private drawBoard(ctx: CanvasRenderingContext2D) {
        ctx.save();
        this.grid.forEach((cell, index) => {
            const row = Math.floor(index / this.games.width);
            const col = index % this.games.width;

            const x = this.offsetWidth + this.calculateBoardSize(col);
            const y = this.offsetHeight + this.calculateBoardSize(row);

            switch (cell.visibility) {
                case Visibility.INVISIBLE:
                    ctx.fillStyle = (cell.hover) ? "#0000FF" : "#FFFFFF";
                    break;
                case Visibility.MARKED:
                    ctx.fillStyle = "#FF0000";
                    break;
                case Visibility.VISIBLE:
                    ctx.fillStyle = (cell.value === 0) ? "#FAAAAA" : "#CCCCCC";
                    break;
                case Visibility.VISIBLY_SATISFIED:
                    ctx.fillStyle = "#00FF00";
                    break;
                default:
                    break;
            }
            ctx.fillRect(x, y, this.settings.defaultCellSize, this.settings.defaultCellSize);
            if (isVisible(cell.visibility)) {
                ctx.fillStyle = "#000000";
                ctx.font = "48px serif";
                const offset = + (this.settings.defaultCellSize / 2);
                ctx.fillText(String(cell.value), x + offset - 15, y + offset + 15);
            }
        });
        ctx.restore();
    }

    private calculateBoardSize(size: number) {
        return (size * this.settings.defaultCellSize) + ((size + 1) * this.settings.gridGapSize)
    }

}



