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
    private readonly backgroundAnimation: AnimationTimer;
    private readonly pieceAnimation: AnimationTimer;

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
        this.pieceAnimation = new AnimationTimer(360, .5, true);
        this.backgroundAnimation = new AnimationTimer(0, 25);            
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
            this.backgroundAnimation.setStep(25);
        } else if (this.inputMode === InputMode.TOGGLE) {
            this.backgroundAnimation.setTarget(0);
            this.backgroundAnimation.setStep(-25);
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
        this.pieceAnimation.update(delta);
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

        const height = this.height - this.backgroundAnimation.getValue();
        const gradient = ctx.createLinearGradient(this.width / 2, height,
            this.width / 2, 0);
        gradient.addColorStop(0.05, '#333');
        gradient.addColorStop(1, 'red');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, height);

        const gradient1 = ctx.createLinearGradient(this.width / 2,
            this.backgroundAnimation.getValue(), this.width / 2, 0);
        gradient1.addColorStop(0.05, '#333');
        gradient1.addColorStop(1, 'blue');
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, height, this.width, this.backgroundAnimation.getValue());

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

            // color
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

            //piece style
            if (cell.visibility === Visibility.INVISIBLE) {
                this.drawInvisiblePiece(ctx, x, y);
            } else {
                ctx.fillRect(x, y, this.settings.defaultCellSize, this.settings.defaultCellSize);
            }
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

    private drawInvisiblePiece(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.save();

        let length = this.settings.defaultCellSize;

        ctx.beginPath();
        ctx.arc(x + length / 2, y + length / 2, length / 2, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        let max = 7;
        let s = this.settings.defaultCellSize;
        let jump = 0;
        for (let i = 1; i < max; i++) {
            const rotation = (i % 2 === 0) ? 1 : -1;
            this.drawRotatingSquare(ctx, jump + x, jump + y, s, rotation);
            jump += (s / 4) / 2;
            s = (s / 4) * 3;
        }

        ctx.restore();
    }

    private drawRotatingSquare(ctx: CanvasRenderingContext2D, worldX: number, worldY: number, cellLength: number,
        rotationDirection: 1 | -1) {
        const radius = cellLength / 8;
        let length = cellLength / 2 + (radius * 2);
        let x = worldX + cellLength / 4 - (radius);
        let y = worldY + cellLength / 4 - (radius);

        ctx.save();
        ctx.beginPath();
        // Draw the rotating bits inside of the circle
        ctx.translate(x + length / 2, y + length / 2);
        ctx.rotate(((this.pieceAnimation.getValue() + 180) * rotationDirection) *  Math.PI / 180);
        ctx.translate((x + length / 2) * -1, (y + length / 2) * -1);

        // start
        ctx.moveTo(x + radius, y);
        // top
        ctx.lineTo(x + length - radius, y);
        ctx.quadraticCurveTo(x + length, y, x + length, y + radius);
        // right
        ctx.lineTo(x + length, y + length - radius);
        ctx.quadraticCurveTo(x + length, y + length, x + length - radius, y + length);
        // bottom
        ctx.lineTo(x + radius, y + length);
        ctx.quadraticCurveTo(x, y + length, x, y + length - radius);
        // left
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);

        ctx.fill();
        ctx.lineWidth = 2;

        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

}



