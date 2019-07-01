import { IDBTable, Table, Field, Query } from "../logic/MetaDataStorage";
import Games from "./Games";

export interface IStatistics {
    id: string;
    name: string;
    // time
    bestTime: number;
    worstTime: number;
    averageTime: number
    totalTimePlayed: number;
    // games played
    wins: number;
    losses: number;
    inprogress: number
    // other
    averageMoves: number;
}

@Table("stats")
export default class Statistics implements IStatistics, IDBTable {

    public tableName = "stats";

    // Game Difficulty
    @Field("stats", true)
    public id: string = "";

    @Field("stats")
    public name: string = "";

    // best and worst
    @Field("stats")
    public bestTime: number = 0;

    @Field("stats")
    public worstTime: number = 0;

    @Field("stats")
    public averageTime: number = 0;

    @Field("stats")
    public totalTimePlayed: number = 0;

    // Games Played
    @Field("stats")
    public wins: number = 0;

    @Field("stats")
    public losses: number = 0;

    @Field("stats")
    public inprogress: number = 0;

    // Other
    @Field("stats")
    public averageMoves: number = 0;


    public get gamesPlayed() {
        return this.wins + this.losses + this.inprogress;
    }

    public static async GetAllStatistics(): Promise<Statistics[]> {
        const statistics = new Statistics();
        const allStatisticsObjects: IStatistics[] = await Query.getAll(statistics);
        if (allStatisticsObjects.length === 0) {
            return [];
        }
        // calculate total
        const stat = new Statistics();
        stat.name = "All Game Modes";
        const allStatistics = allStatisticsObjects.map( (item) => {
            // global all games
            stat.bestTime = (item.bestTime < stat.bestTime) ? item.bestTime : stat.bestTime;
            stat.worstTime = (item.worstTime > stat.worstTime) ? item.worstTime : stat.worstTime;
            stat.averageTime += item.averageTime;
            stat.averageMoves += item.averageMoves;
            stat.wins += item.wins;
            stat.losses += item.losses;
            stat.inprogress += item.inprogress;
            stat.totalTimePlayed += item.totalTimePlayed;
            // spesific item
            item.averageMoves = Math.round(item.averageMoves);
            return Object.assign(new Statistics(), item);
        }, statistics);
        stat.averageMoves = Math.round(stat.averageMoves / allStatistics.length);
        stat.averageTime = stat.averageTime / allStatistics.length;
        allStatistics.unshift(stat);
        return allStatistics;
    }

    public static async GetStats(id: string): Promise<Statistics> {
        const statistics = new Statistics();
        const cacheStats = await Query.getById(statistics, Query.sanitizeId(id));
        // not undefined
        if (cacheStats === undefined) {
            console.log('default');
            debugger;
            return statistics;
        } else {
            console.log('actual');
            debugger;
            return Object.assign(statistics, cacheStats);
        }
    }

    public static async AddGame(id: string) {
        const s = await Statistics.GetStats(Query.sanitizeId(id));
        s.inprogress += 1;
        s.name = id;
        s.id = Query.sanitizeId(id);
        return await Query.save(s);
    }

    public static async AddGameResults(game: Games): Promise<boolean> {
        if (game.result === "created" || game.result === "inprogress") {
            return Promise.resolve(false);
        }
        const s = await Statistics.GetStats(game.difficulty);
        console.log('before ', Object.assign({}, s), game);
        // general stuff and averages
        s.inprogress -= 1;
        s.totalTimePlayed += game.time;
        
        // wins
        if (game.result === "won") {
            s.wins += 1;
            s.averageMoves = Statistics.ComputeAvg(s.gamesPlayed, s.averageMoves, game.totalMoves);
            s.averageTime = Statistics.ComputeAvg(s.gamesPlayed, s.averageTime, game.time);
            
            // best times per game type
            if (s.bestTime >= game.time || s.bestTime === 0) { // best time doesn't exist for difficulty
                if (Math.floor(game.time) === 0) {
                    s.bestTime = 1;
                } else {
                    s.bestTime = Math.floor(game.time);
                }
            }
            if (s.worstTime <= game.time || s.worstTime === 0) {
                if (Math.floor(game.time) === 0) {
                    s.worstTime = 1;
                } else {
                    s.worstTime = Math.floor(game.time);
                }
            }
        }
        // losses
        else {
            s.losses += 1;
        }
        
        console.log('after ', s, game);
        return await Query.save(s);
    }

    private static ComputeAvg(numOfItems: number, currentAverage: number, newValue: number) {
        if (numOfItems <= 1) {
            return newValue;
        }
        return (currentAverage * (numOfItems - 1) + newValue) / numOfItems;
    }
}