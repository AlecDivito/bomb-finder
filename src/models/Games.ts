import { Table, Field, IndexDbTable } from '../logic/MetaDataStorage';
import { GameDifficulty, GameProgress } from './GameTypes';
import { Cell } from './GameBoardTypes';
import Game from '../pages/game';

@Table()
export default class Games extends IndexDbTable {
    // Initial Game data
    @Field(true)
    public id: string;
    @Field()
    public time: number = 0;
    @Field()
    public readonly difficulty: GameDifficulty;
    @Field()
    public readonly width: number;
    @Field()
    public readonly height: number;
    @Field()
    public readonly bombs: number;

    // Game being played data
    @Field()
    public board: Cell[];
    @Field()
    public totalMoves: number = 0;
    @Field()
    public invisiblePieces: number;
    @Field()
    public isComplete: boolean = false;
    @Field()
    public result: GameProgress;
    @Field()
    public finishedAt: Date = new Date();
    @Field()
    public createdAt: Date = new Date();

    constructor(
        id: string,
        difficulty: GameDifficulty,
        width: number,
        height: number,
        bombs: number,
    ) {
        super();
        this.id = id;
        this.time = 0;
        this.difficulty = difficulty;
        this.width = width;
        this.height = height;
        this.bombs = bombs;
        this.board = [];
        this.invisiblePieces = this.totalPieces;
        this.result = "created";
    }

    public get totalPieces() {
        return (this.width * this.height) - this.bombs;
    }

    static async DoesGameExists(id: string): Promise<boolean> {
        const games = new Games("", "easy", 0, 0, 0);
        const result = await games.getById(id);
        return result !== undefined;
    }

    static async GetGame(id: string): Promise<Games> {
        const games = new Games("", "easy", 0, 0, 0);
        const result: any = await games.getById(id);
        if (result === undefined) {
            // TODO: better error message
            throw new Error("Game does not exist, This shouldn't be called");
        }
        return this.CreateGame(result);
    }

    static CreateGame(game: Games): Games {
        const games = new Games(game.id, game.difficulty, game.width, game.height, game.bombs);
        games.time = game.time;
        games.board = game.board;
        games.totalMoves = game.totalMoves;
        games.invisiblePieces = game.invisiblePieces;
        games.isComplete = game.isComplete;
        games.result = game.result;
        games.finishedAt = game.finishedAt;
        games.createdAt = game.createdAt;
        return games;
    }

}