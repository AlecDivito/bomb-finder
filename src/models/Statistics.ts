import { IndexDbTable, Table, Field } from "../logic/MetaDataStorage";

@Table()
export default class Statistics extends IndexDbTable {

    @Field(true)
    public readonly statistics: string = "statistics";

    // best and worst
    @Field()
    public bestTime: {[key: string]: number} = {};

    @Field()
    public worstTime: {[key: string]: number} = {};

    @Field()
    public longestGame: number = 0;

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

    @Field()
    public averageInvisiblePiecesPerLoss: number = 0;

    // inprogress
    @Field()
    public inprogress: number = 0;


    public static async GetStats(): Promise<Statistics> {
        const stats = new Statistics();
        const savedStats = await stats.getById(stats.statistics) as any;
        // not undefined
        if (savedStats) {
            return savedStats;
        }
        else {
            stats.save();
            return stats;
        }
    }
}