import { Table, Field, Query, IDBTable } from "../logic/MetaDataStorage";

export interface IPreferences {
    // soundVolume: number;
    // musicVolume: number;
    defaultCellSize: number; // slider
    gridGapSize: number;     // slider
    spinningCubes: number;   // slider
    simpleRender: boolean;   // checkbox
    // fullScreen: boolean; // checkbox, don't save
    vibration: boolean;
    timestamp: Date;
}

@Table("settings")
export default class Preferences implements IPreferences, IDBTable {
    
    public tableName = "settings";

    @Field("settings", true)
    public readonly id: string = "preferences";

    @Field("settings")
    public defaultCellSize: number = 35;

    @Field("settings")
    public gridGapSize: number = 8.5;

    @Field("settings")
    public spinningCubes: number = 7;

    @Field("settings")
    public simpleRender: boolean = false;

    @Field("settings")
    public vibration: boolean = false;
    
    @Field("settings")
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