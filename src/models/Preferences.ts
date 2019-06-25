import { Table, Field, Query } from "../logic/MetaDataStorage";

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
export default class Preferences implements IPreferences {
    
    @Field(true)
    public readonly preferences: string = "preferences";

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
        const cachedSettings: IPreferences = await Query.getById(preferences, preferences.preferences);
        // not defined
        if (cachedSettings) {
            return cachedSettings;
        }
        else {
            return preferences;
        }
    }

    static async Save(preferences: IPreferences) {
        preferences.timestamp = new Date();
        const settings = Object.assign(new Preferences(), preferences);
        return await Query.save(settings);
    }

}