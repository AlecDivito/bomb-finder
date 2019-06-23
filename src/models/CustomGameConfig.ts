import { Table, Field, Query } from "../logic/MetaDataStorage";
import uuid from "../util/uuid";
import { FormError } from "./Types";

export interface ICustomGameConfig {
    id?: string;
    width: number;
    height: number;
    bombs: number;
    name?: string;
    save?: boolean;
    createdAt?: Date;
}

const EASY_ID = "00000000-0000-0000-0000-000000000001";
const MEDIUM_ID = "00000000-0000-0000-0000-000000000002";
const HARD_ID = "00000000-0000-0000-0000-000000000003";

const DEFAULT_TEMPLATES: ICustomGameConfig[] = [
    {
        id: EASY_ID,
        name: "easy",
        width: 8,
        height: 8,
        bombs: 10,
    },
    {
        id: MEDIUM_ID,
        name: "medium",
        width: 16,
        height: 16,
        bombs: 40,
    },
    {
        id: HARD_ID,
        name: "hard",
        width: 24,
        height: 24,
        bombs: 99,
    }
];

@Table()
export default class CustomGameConfig implements ICustomGameConfig {

    @Field(true)
    public id: string = "";

    @Field()
    public name?: string = undefined;

    @Field()
    public width: number = 8;

    @Field()
    public height: number = 8;

    @Field()
    public bombs: number = 10;

    @Field()
    public isDeleted: boolean = false;

    @Field()
    public createdAt: Date = new Date();

    public save: boolean = false;

    static async save(config: ICustomGameConfig) {
        const save = Object.assign(new CustomGameConfig(), config,
            {id: uuid(), createdAt: new Date()});
        return await Query.save(save);
    }

    static async getAll(): Promise<ICustomGameConfig[]> {
        let templates = await Query.getAll(new CustomGameConfig());
        // check if the default objects exist
        // if they don't, add them to the store and templates array
        const defaultTemplates = templates
            .filter(t => /^[0]{8}-[0]{4}-[0]{4}-[0]{4}-[0]{11}[1-3]$/.test(t.id));
        if (defaultTemplates.length === 0) { // there is no default templates inside the tempaltes
            const savedDefaultTemplates = await this.addDefaultTemplateGames();
            templates = savedDefaultTemplates;
        }
        else {
            // if they do, filter the templates out IF they are deleted
            templates = templates.filter(item => !item.isDeleted)
        }
        return templates;
    }

    static async getById(id: string) {
        return await Query.getById(new CustomGameConfig(), id);
    }
    
    static validate(config: ICustomGameConfig) {
        const errors: FormError<ICustomGameConfig> = {};
        Object.keys(config).forEach((key) => {
            switch (key) {
                case 'width':
                case 'height':
                    if (config[key] > 50) {
                        errors[key] = `${key} is too high!`;
                    } else if (config[key] < 5) {
                        errors[key] = `${key} is too low!`;
                    }
                    break;
                case 'bombs':
                    if (config.bombs > (config.width * config.height) - 1) {
                        errors.bombs = `Too many bombs! (Max: ${(config.width * config.height) - 1})`;
                    } else if (config.bombs < 5) {
                        errors.bombs = "Too few bombs! (Min: 5)";
                    }
                    break;
                case 'name':
                    if (config.save && typeof(config.name) === "string" ) {
                        if (config.name.length > 16) {
                            errors.name = "Name is too long!";
                        } else if (config.name.length === 0) {
                            errors.name = "Name cannot be empty!";
                        }
                    }
            }
        });
        return errors;
    }

    private static async addDefaultTemplateGames() {
        const templates = DEFAULT_TEMPLATES.map(temp => 
            Object.assign(new CustomGameConfig(), temp));
        for (let i = 0; i < templates.length; i++) {
            await Query.save(templates[i]);
        }
        // TODO: Add error handling
        return templates;
    }
}

