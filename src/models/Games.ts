import { Table, Field, Query, IDBTable } from '../logic/MetaDataStorage';
import { GameDifficulty, GameProgress } from './GameTypes';
import { Cell } from './GameBoardTypes';
import uuid from '../util/uuid';
import Statistics from './Statistics';

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
    updatedAt: Date;
    createdAt: Date;
}

@Table("Games")
export default class Games implements IGames, IDBTable {
    
    public tableName = "Games";

    // Initial Game data
    @Field("Games", true)
    public id: string = "";
    @Field("Games")
    public time: number = 0;
    @Field("Games")
    public difficulty: GameDifficulty = "";
    @Field("Games")
    public width: number = 0;
    @Field("Games")
    public height: number = 0;
    @Field("Games")
    public bombs: number = 0;

    // Game being played data
    @Field("Games")
    public board: Cell[] = [];
    @Field("Games")
    public totalMoves: number = 0;
    @Field("Games")
    public invisiblePieces: number = 0;
    @Field("Games")
    public isComplete: boolean = false;
    @Field("Games")
    public result: GameProgress = "created";
    @Field("Games")
    public updatedAt: Date = new Date();
    @Field("Games")
    public createdAt: Date = new Date();

    private constructor() { }

    public get totalPieces() {
        return (this.width * this.height) - this.bombs;
    }

    public get gameHasStarted() {
        return this.result === "inprogress";
    }

    public get area() {
        return this.width * this.height;
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
    public async reset(oldGame: Games): Promise<Games> {
        // TODO: Add error handling (need to add in games first (down there))
        const newGame = await Games.Create(oldGame.difficulty, oldGame.width,
            oldGame.height, oldGame.bombs);
        return newGame;
    }

    public update(): Promise<boolean> {
        this.updatedAt = new Date();
        return Query.save(this);
    }

    public async logAndDestroy() {
        // TODO: maybe throw an error here, if one fails, can't really tell which
        //       one failed
        return await Query.remove(this) && await Statistics.AddGameResults(this);
    }

    static async Create(
        difficulty: GameDifficulty,
        width: number,
        height: number,
        bombs: number,
    ) {
        const game = new Games();
        game.id = uuid();
        game.difficulty = difficulty;
        game.width = width;
        game.height = height;
        game.bombs = bombs;
        game.invisiblePieces = game.totalPieces;
        const result = await Query.save(game);
        const stats = await Statistics.AddGame(game.difficulty);
        if (!result) {
            // TODO: Add Error handling
            // this is temporary
            console.warn("Couldn't save new game");
        }
        if (!stats) {
            console.warn("Couldn't save stats");
        }
        return game;
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
        const result = await Query.getById(new Games(), id);
        if (result === undefined) {
            // TODO: better error message
            throw new Error("Game does not exist, This shouldn't be called");
        }
        const newGame = Object.assign(new Games(), result);
        return newGame;
    }

    static async GetUnfinishedGames(): Promise<IGames[]> {
        const data = await Query.getAll(new Games(),
            (game: Games) => game.result === "created" || game.result === "inprogress"
        );
        return data;
    }

    static async GetLastPlayedGame(): Promise<IGames | undefined> {
        const games: IGames[] = await Query.getAll(new Games());
        if (games.length === 0) {
            return undefined;
        }
        let game = games[0];
        for (let i = 1; i < games.length; i++) {
            if (game.updatedAt.getTime() < games[i].updatedAt.getTime()) {
                game = games[i];
            }
        }
        return game;
    }
}