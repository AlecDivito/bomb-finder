import { Table, Field, IndexDbTable } from '../logic/MetadataArgs';
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
        board: Cell[],
    ) {
        super();
        this.id = id;
        this.time = 0;
        this.difficulty = difficulty;
        this.width = width;
        this.height = height;
        this.bombs = bombs;
        this.board = board;
        this.invisiblePieces = this.totalPieces;
        this.result = "inprogress";
    }

    public get totalPieces() {
        return (this.width * this.height) - this.bombs;
    }

    public update(delta: number) {
        
    }

}