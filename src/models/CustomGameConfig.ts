import { Table, Field, Query } from "../logic/MetaDataStorage";
import uuid from "../util/uuid";
import { FormError } from "./Types";

export interface ICustomGameConfig {
    width: number;
    height: number;
    bombs: number;
    name?: string;
    save?: boolean;
}

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

    public save: boolean = false;

    static async save(config: ICustomGameConfig) {
        const save = Object.assign(new CustomGameConfig(), config, {id: uuid()});
        return await Query.save(save);
    }

    static async getAll(): Promise<ICustomGameConfig[]> {
        return await Query.getAll(new CustomGameConfig());
    }

    static async getById() {
        return await Query.getById(new CustomGameConfig());
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
}

