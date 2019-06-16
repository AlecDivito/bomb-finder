import { Table, IndexDbTable, Field } from "../logic/MetaDataStorage";


@Table()
export default class Preferences extends IndexDbTable {
    
    @Field(true)
    public readonly preferences: string = "preferences";
    
    @Field()
    public soundVolume: number;
    
    @Field()
    public musicVolume: number;

    @Field()
    public defaultCellSize: number;

    @Field()
    public gridGapSize: number;

    @Field()
    public allowFlags: boolean;
    
    @Field()
    public showMilliseconds: boolean;

    @Field()
    public timestamp: Date;

    constructor() {
        super();
        this.allowFlags = true;
        this.soundVolume = 1;
        this.musicVolume = 1;
        this.defaultCellSize = 35;
        this.gridGapSize = 8.5;
        this.showMilliseconds = false;
        this.timestamp = new Date();
    }

    public async save() {
        this.timestamp = new Date();
        return await super.save();
    }

    static CreatePreferences(preferences: Readonly<Preferences>) {
        const p = new Preferences();
        p.allowFlags = preferences.allowFlags;
        p.soundVolume = preferences.soundVolume;
        p.musicVolume = preferences.musicVolume;
        p.showMilliseconds = preferences.showMilliseconds;
        return p;
    }

    static async GetPreferences() {
        const p = new Preferences();
        const newP = await p.getById(p.preferences) as any;
        // not undefined
        if (newP) {
            return newP;
        }
        else {
            // undefined
            p.save();
            return p;
        }
    }

}