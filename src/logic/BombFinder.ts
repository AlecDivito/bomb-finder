import { Cell, CellState, CellValue, Visibility } from "../models/GameBoardTypes";
import { EventState } from "../models/EventTypes";
import InSquare from "../util/InSquare";
import { GameStatus, Point2d } from "../models/GameTypes";
import Games from "../models/Games";

export default class BombFinder {

    private games: Games;

    private grid: Cell[] = [];
    private time: number = 0;
    private gameStart: boolean = false;
    private updateRemainingPiecesCount: boolean = false;
    private remainingPieces: number = 0;
    private gameStatus: GameStatus = GameStatus.GAME_PLAY;
    private readonly width: number;
    private readonly height: number;
    private readonly bombs: number;

    // TODO: set the gaps and size dynamically
    //       we probably need to redo the way we pass in
    //       values to the constructor
    private readonly gaps: number = 15;
    private readonly size: number = 75;

    private get area(): number {
        return this.width * this.height;
    }

    constructor(games: Games) {
        this.width = games.width;
        this.height = games.height;
        this.bombs = games.bombs;
        this.games = games;
        this.init();
    }

    public get isGameOver() {
        return this.gameStatus === GameStatus.GAME_LOSE;
    }

    public get isGameWon() {
        return this.gameStatus === GameStatus.GAME_WON;
    }

    public get getRemainingAvailablePiece() {
        return this.remainingPieces;
    }

    public get getTotalAvailablePieces() {
        return this.area - this.bombs;
    }

    public get getTime() {
        return Math.floor(this.time);
    }

    public get getHeight() {
        return this.height;
    }

    public get getWidth() {
        return this.width;
    }

    public get getGaps() {
        return this.gaps;
    }

    public get getSize() {
        return this.size;
    }

    public get getGrid(): Readonly<Cell[]> {
        return this.grid;
    }

    public get numberOfBombs() {
        return this.bombs;
    }

    public reset() {
        this.init();
    }

    public update(delta: number) {
        if (this.gameStart && this.gameStatus === GameStatus.GAME_PLAY) {
            this.time += delta / 1000;
            this.games.time += delta / 1000;
        }
        if (this.updateRemainingPiecesCount) {
            let counter = this.getTotalAvailablePieces;
            this.grid.forEach((cell) =>
                (cell.visibility === Visibility.VISIBLE)
                    ? counter--
                    : counter
            );
            this.remainingPieces = counter;
            this.updateRemainingPiecesCount = false;
            this.games.invisiblePieces = this.getRemainingAvailablePiece;
            this.games.totalMoves++;
            this.games.save();
        }
        if (this.gameStatus === GameStatus.GAME_LOSE) {
            this.grid.forEach((cell) => cell.visibility = Visibility.VISIBLE);
            this.games.board = this.grid;
            this.games.isComplete = true;
            this.games.result = "lost";
            this.games.finishedAt = new Date();
            this.games.save();
        }
        else if (this.remainingPieces === 0) {
            this.gameStatus = GameStatus.GAME_WON;
            this.grid.forEach((cell) => cell.visibility = Visibility.VISIBLE);
            this.games.board = this.grid;
            this.games.isComplete = true;
            this.games.result = "won";
            this.games.finishedAt = new Date();
            this.games.save();
        }
    }

    public handleEvents(events: EventState) {
        if (this.gameStatus !== GameStatus.GAME_PLAY) {
            return;
        }
        if (events.mouse !== undefined) {
            this.grid.forEach((cell) => {
                cell.hover = false;
            });
            const point: Point2d = { x: events.mouse.localX, y: events.mouse.localY };
            const index = this.getIndexByPixel(point);
            if (index !== null && index < this.grid.length) {
                this.grid[index].hover = true;
            }
        }
        if (events.mouseButton !== undefined) {
            this.gameStart = true;
            const point: Point2d = { x: events.mouseButton.localX, y: events.mouseButton.localY };
            const index = this.getIndexByPixel(point);
            if (index !== null && index < this.grid.length) {
                if (events.mouseButton.left && this.grid[index].visibility === Visibility.INVISIBLE) {
                    this.grid[index].visibility = Visibility.VISIBLE;
                    if (this.grid[index].value === null || this.grid[index].value === undefined) {
                        this.gameStatus = GameStatus.GAME_LOSE;
                    }
                    else {
                        if (this.grid[index].value === 0) {
                            this.toggleCell(index);
                        }
                        this.updateRemainingPiecesCount = true;
                    }
                } else if (events.mouseButton.right && this.grid[index].visibility !== Visibility.MARKED) {
                    this.grid[index].visibility = Visibility.MARKED;
                } else if (events.mouseButton.right && this.grid[index].visibility === Visibility.MARKED) {
                    this.grid[index].visibility = Visibility.INVISIBLE;
                }
            }
        }
    }


    protected init() {
        this.time = 0;
        this.gameStart = false;
        this.gameStatus = GameStatus.GAME_PLAY;
        this.remainingPieces = this.getTotalAvailablePieces;
        this.grid = this.constructGrid();
        this.games.board = this.grid;
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
            this.grid[i].visibility = Visibility.VISIBLE;
            visited.push(i);
        }
    }

    private getIndexByPixel(point: Point2d): number | null {
        const cellSize = this.gaps + this.size;
        const row = Math.floor(point.y / cellSize);
        const col = Math.floor(point.x / cellSize);

        // check if pointer is inside square
        const top = (row * cellSize) + this.gaps;
        const left = (col * cellSize) + this.gaps;

        if (InSquare({ top, left, size: this.size }, point)) {
            return this.getIndex(row, col);
        }
        return null;
    }

    private getIndex(row: number, col: number): number {
        return (row * this.width) + col;
    }

    private constructGrid(): Cell[] {
        const grid: Array<Cell | null> = [];

        // create the grid
        for (let i = 0; i < this.area; i++) {
            grid.push(null);
        }

        // place the bombs
        let bombCounter = this.bombs;
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
        const row = Math.floor(index / this.width);
        const col = index % this.width;
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
            if (tempRow >= 0 && tempRow < this.height && // check if the index is in the gird
                tempCol >= 0 && tempCol < this.width) {
                neighbors.push(tempIndex);
            }
        }
        return neighbors;
    }



}


