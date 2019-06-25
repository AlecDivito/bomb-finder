import { Table, Field, Query } from "../logic/MetaDataStorage";

export interface IPreferences {
    soundVolume: number;
    musicVolume: number;
    defaultCellSize: number;
    gridGapSize: number;
    allowFlags: boolean;
    showMilliseconds: boolean;
    timestamp: Date;
}

@Table()
export default class Preferences implements IPreferences {
    
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