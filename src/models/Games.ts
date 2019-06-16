import { Table, Field, IndexDbTable } from '../logic/MetaDataStorage';
import { GameDifficulty, GameProgress } from './GameTypes';
import { Cell } from './GameBoardTypes';

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

    public get gameHasStarted() {
        return this.result === "inprogress";
    }

    public set setResult(result: GameProgress) {
        if (this.result !== "lost" && this.result !== "won") {
            this.result = result;
        }
    }

    public async reset(newId: string): Promise<Games> {
        await this.save();
        const game = new Games(newId, this.difficulty, this.width,
            this.height, this.bombs);
        await game.save();
        return game;
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

    static async GetUnfinishedGames(): Promise<Games[]> {
        const games = new Games("", "easy", 0, 0, 0);
        const data = await games.getAll(
            (game: Games) => game.result === "created" || game.result === "inprogress"
        );
        return data;
    }

    // static async GetGameStatistics(): Promise<Statistics> {
    //     const game = new Games("", "easy", 0, 0, 0);
    //     const games = await game.getAll((game: Games) => true);
    //     const statistics = {
    //         gamesPlayed: 0,
    //         wins: 0,
    //         losses: 0,
    //         incomplete: 0,
    //         averageNumberOfMovesWin: 0,
    //         averageNumberOfMovesLoss: 0,
    //         averageNumberOfMovesTotal: 0,
    //         averageTimeTakenLoss: 0,
    //         averageTimeTakenWin: 0,
    //         averageTimeTakenTotal: 0,
    //         averageNumberOfInvisiblePieces: 0,
    //     };
    //     games.forEach((g) => {
    //         statistics.gamesPlayed++;
    //         if (g.result === "won") {
    //             statistics.wins++;
    //             statistics.averageNumberOfMovesWin += g.totalMoves;
    //             statistics.averageTimeTakenWin += g.time;
    //         } else if (g.result === "lost") {
    //             statistics.losses++;
    //             statistics.averageNumberOfInvisiblePieces += g.invisiblePieces;
    //             statistics.averageNumberOfMovesLoss += g.totalMoves;
    //             statistics.averageTimeTakenLoss += g.time;
    //         } else {
    //             statistics.incomplete++;
    //         }
    //     });
    //     statistics.averageTimeTakenTotal = (statistics.averageTimeTakenLoss +
    //         statistics.averageTimeTakenWin) / (statistics.wins + statistics.losses);
    //     statistics.averageNumberOfMovesTotal = (statistics.averageNumberOfMovesWin +
    //         statistics.averageNumberOfMovesLoss) / (statistics.wins + statistics.losses);

    //     statistics.averageNumberOfInvisiblePieces /= statistics.losses;
    //     statistics.averageNumberOfMovesLoss /= statistics.losses;
    //     statistics.averageTimeTakenLoss /= statistics.losses;

    //     statistics.averageNumberOfMovesWin /= statistics.wins;
    //     statistics.averageTimeTakenWin /= statistics.wins;

    //     return statistics;
    // }


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