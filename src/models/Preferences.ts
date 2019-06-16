import { Table, IndexDbTable, Field } from "../logic/MetaDataStorage";


@Table()
export default class Preferences extends IndexDbTable {
    
    @Field(true)
    public readonly preferences: string = "preferences";
    
    @Field()
    public soundVolume: number = 0;
    
    @Field()
    public musicVolume: number = 0;

    @Field()
    public defaultCellSize: number = 35;

    @Field()
    public gridGapSize: number = 8.5;

    @Field()
    public allowFlags: boolean = true;
    
    @Field()
    public showMilliseconds: boolean = false;

    @Field()
    public timestamp: Date = new Date();

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
        p.defaultCellSize = preferences.defaultCellSize;
        p.gridGapSize = preferences.gridGapSize;
        return p;
    }

    static async GetPreferences(): Promise<Preferences> {
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