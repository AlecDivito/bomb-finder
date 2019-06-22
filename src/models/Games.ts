import { Table, Field, Query } from '../logic/MetaDataStorage';
import { GameDifficulty, GameProgress } from './GameTypes';
import { Cell } from './GameBoardTypes';
import uuid from '../util/uuid';

export interface IGames {
    id: string;
    time: number;
    difficulty: GameDifficulty;
    width: number;
    height: number;
    bombs: number;
    board: Cell[];
    totalMoves: number;
    invisiblePieces: number;
    isComplete: boolean;
    result: GameProgress;
    finishedAt: Date;
    createdAt: Date;
}

@Table()
export default class Games implements IGames {
    // Initial Game data
    @Field(true)
    public id: string = "";
    @Field()
    public time: number = 0;
    @Field()
    public difficulty: GameDifficulty = "";
    @Field()
    public width: number = 0;
    @Field()
    public height: number = 0;
    @Field()
    public bombs: number = 0;

    // Game being played data
    @Field()
    public board: Cell[] = [];
    @Field()
    public totalMoves: number = 0;
    @Field()
    public invisiblePieces: number = 0;
    @Field()
    public isComplete: boolean = false;
    @Field()
    public result: GameProgress = "created";
    @Field()
    public finishedAt: Date = new Date();
    @Field()
    public createdAt: Date = new Date();

    private constructor() { }

    public static Create(
        id: string,
        difficulty: GameDifficulty,
        width: number,
        height: number,
        bombs: number,
    ) {
        const game = new Games();
        game.id = id;
        game.difficulty = difficulty;
        game.width = width;
        game.height = height;
        game.bombs = bombs;
        game.invisiblePieces = game.totalPieces;
        return game;
    }

    public get totalPieces() {
        return (this.width * this.height) - this.bombs;
    }

    public get gameHasStarted() {
        return this.result === "inprogress";
    }

    public set setResult(result: GameProgress) {
        if (this.result !== "lost" && this.result !== "won") {
            this.result = result;
        }
    }

    /**
     * 
     * @param game game thats finished
     * @param newId id of the new game
     */
    public async reset(oldGame: Games): Promise<Games | undefined> {
        const oldGameSaved = await Games.save(oldGame);
        if (oldGameSaved) {
            const newGame = Games.Create(uuid(), oldGame.difficulty, oldGame.width, oldGame.height, oldGame.bombs);
            await Games.save(newGame);
            return newGame;
        }
        return undefined;
    }

    static async save(game: Games): Promise<boolean> {
        return await Query.save(game);
    }

    static async DoesGameExists(id: string): Promise<boolean> {
        try {
            await Games.GetById(id);
            return true;
        } catch (e) {
            return false;
        }
    }

    static async GetById(id: string): Promise<Games> {
        const result: IGames = await Query.getById(new Games(), id);
        if (result === undefined) {
            // TODO: better error message
            throw new Error("Game does not exist, This shouldn't be called");
        }
        return Object.assign(new Games(), result);
    }

    static async GetUnfinishedGames(): Promise<IGames[]> {
        const data = await Query.getAll(new Games(),
            (game: Games) => game.result === "created" || game.result === "inprogress"
        );
        return data;
    }
}