import { Table, IndexDbTable, Field } from "../logic/MetaDataStorage";


@Table()
export default class Preferences extends IndexDbTable {
    
    @Field(true)
    public readonly preferences: string = "preferences";

    @Field()
    public allowFlags: boolean;

    @Field()
    public soundVolume: number;

    @Field()
    public musicVolume: number;

    @Field()
    public showMilliseconds: boolean;

    @Field()
    public timestamp: Date;

    constructor() {
        super();
        this.allowFlags = true;
        this.soundVolume = 1;
        this.musicVolume = 1;
        this.showMilliseconds = false;
        this.timestamp = new Date();
    }

    public async save() {
        this.timestamp = new Date();
        return await super.save();
    }
}