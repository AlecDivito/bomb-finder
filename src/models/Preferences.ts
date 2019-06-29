import { Table, Field, Query, IDBTable } from "../logic/MetaDataStorage";

export interface IPreferences {
    // soundVolume: number;
    // musicVolume: number;
    defaultCellSize: number; // slider
    gridGapSize: number;     // slider
    spinningCubes: number;   // slider
    simpleRender: boolean;   // checkbox
    // fullScreen: boolean; // checkbox, don't save
    timestamp: Date;
}

@Table()
export default class Preferences implements IPreferences, IDBTable {
    
    @Field(true)
    public readonly id: string = "preferences";

    @Field()
    public defaultCellSize: number = 35;

    @Field()
    public gridGapSize: number = 8.5;

    @Field()
    public spinningCubes: number = 7;

    @Field()
    public simpleRender: boolean = false;
    
    @Field()
    public timestamp: Date = new Date();

    static async GetPreferences(): Promise<IPreferences> {
        const preferences = new Preferences();
        const cachedSettings = await Query.getById(preferences, preferences.id);
        // not defined
        if (cachedSettings === undefined) {
            return preferences;
        } else {
            return cachedSettings;
        }
    }

    static async Save(preferences: IPreferences) {
        preferences.timestamp = new Date();
        const settings = Object.assign(new Preferences(), preferences);
        return await Query.save(settings);
    }

}