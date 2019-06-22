import { Table, Field, Query } from "../logic/MetaDataStorage";
import Games from "./Games";

export interface IStatistics {
    bestTime: { [key: string]: number };
    // worstTime: { [key: string]: number };
    // longestGame: number;
    // general
    inprogress: number
    gamesPlayed: number;
    averageNumberOfMoves: number;
    averageTime: number;
    // wins
    wins: number;
    averagesMovesPerWin: number;
    averageTimePerWin: number;
    // losses
    losses: number;
    averagesMovesPerLoss: number;
    averageTimePerLoss: number;
}

@Table()
export default class Statistics implements IStatistics {

    @Field(true)
    public readonly statistics: string = "statistics";

    // best and worst
    @Field()
    public bestTime: {[key: string]: number} = {};

    // @Field()
    // public worstTime: {[key: string]: number} = {};

    // @Field()
    // public longestGame: number = 0;

    // average
    @Field()
    public gamesPlayed: number = 0;

    @Field()
    public averageNumberOfMoves: number = 0;

    @Field()
    public averageTime: number = 0;

    // wins
    @Field()
    public wins: number = 0;

    @Field()
    public averagesMovesPerWin: number = 0;

    @Field()
    public averageTimePerWin: number = 0;

    // losses
    @Field()
    public losses: number = 0;

    @Field()
    public averagesMovesPerLoss: number = 0;

    @Field()
    public averageTimePerLoss: number = 0;

    // inprogress TODO: figure out if we need this counter
    @Field()
    public inprogress: number = 0;


    public static async GetStats(): Promise<Statistics> {
        const statistics = new Statistics();
        const cacheStats: IStatistics = await Query.getById(statistics, statistics.statistics);
        // not undefined
        if (cacheStats) {
            const stats = Object.assign(statistics, cacheStats);
            return stats;
        }
        else {
            return statistics;
        }
    }

    public static async AddGame() {
        const s = await Statistics.GetStats();
        s.inprogress++;
        return await Query.save(s);
    }

    public static async AddGameResults(game: Games): Promise<boolean> {
        if (game.result === "created" || game.result === "inprogress") {
            return Promise.resolve(false);
        }
        const s = await Statistics.GetStats();
        // general stuff and averages
        s.inprogress--;
        s.gamesPlayed++;
        s.averageNumberOfMoves = Statistics.ComputeAvg(s.gamesPlayed, s.averageNumberOfMoves, game.totalMoves);
        s.averageTime = Statistics.ComputeAvg(s.gamesPlayed, s.averageTime, game.time);

        // wins
        if (game.result === "won") {
            s.wins++;
            s.averagesMovesPerWin = Statistics.ComputeAvg(s.wins, s.averagesMovesPerWin, game.totalMoves);
            s.averageTimePerWin = Statistics.ComputeAvg(s.wins, s.averageTimePerWin, game.time);

            // best times per game type
            if (!s.bestTime[game.difficulty]) { // best time doesn't exist for difficulty
                s.bestTime[game.difficulty] = game.time;
            } else {
                const best = s.bestTime[game.difficulty];
                s.bestTime[game.difficulty] = (best < game.time) ? game.time : best;
            }
        }
        // losses
        else {
            s.losses++;
            s.averagesMovesPerLoss = Statistics.ComputeAvg(s.losses, s.averagesMovesPerLoss, game.totalMoves);
            s.averageTimePerLoss = Statistics.ComputeAvg(s.losses, s.averageTimePerLoss, game.time);
        }

        return Query.save(s);
    }

    private static ComputeAvg(numOfItems: number, currentAverage: number, newValue: number) {
        if (numOfItems <= 1) {
            return newValue;
        }
        return (currentAverage * (numOfItems - 1) + newValue) / numOfItems;
    }
}