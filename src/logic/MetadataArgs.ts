
type TableMetaData = {
    table: string,
    primaryKey?: string,
    version: number,
    fields: string[],
};

export class MetaDataStorage {

    public static getInstance() {
        return MetaDataStorage.instance ||
            (MetaDataStorage.instance = new MetaDataStorage());
    }

    private static instance: MetaDataStorage;

    private storage: Array<TableMetaData>;
    
    private tableQueue: Array<{
        primaryKey: boolean,
        table: string;
        field: string;
    }>;

    private constructor() {
        this.storage = [];
        this.tableQueue = [];
    }

    public addTable(table: string, version: number) {
        const fields = this.tableQueue
            .filter(item => item.table === table)
            .map(item => item.field);
        const primaryKey = this.tableQueue.filter(item => item.primaryKey)[0].field;
        const record = { table, version, fields, primaryKey };
        this.storage.push(record);
    }

    public addField(table: string, field: string, isPrimary: boolean) {
        const item = this.storage.find((o) => o.table === table);
        if (item !== undefined) {
            item.fields.push(field);
        }
        else {
            this.tableQueue.push({ table, field, primaryKey: isPrimary});
        }
    }

    public getPrimaryKey(table: string): string | undefined {
        const metaData = this.storage.find(s => s.table === table);
        if (!metaData) {
            return undefined;
        }
        if (!metaData.primaryKey) {
            return undefined;
        }
        return metaData.primaryKey;
    }

    public getMetaData(table: string): TableMetaData | undefined {
        return this.storage.find(s => s.table === table);
    }

    public print() {
        console.log(this.storage);
    }
}

enum StorageOption {
    INDEXDB,
    LOCAL_STORAGE,
    MEMORY,
} 

export class IndexDbTable {

    private storageType: StorageOption;
    private database?: IDBDatabase;
    private data?: { [key: string]: any }

    constructor() {
        if (window.indexedDB) {
            this.storageType = StorageOption.INDEXDB;
        }
        else if (window.localStorage) {
            this.storageType = StorageOption.LOCAL_STORAGE;
        }
        else {
            this.storageType = StorageOption.MEMORY;
        }
        this.connection();
    }

    async getAll() {
        return new Promise(async (resolve, reject) => {
            if (!this.database) {
                await this.connection();
            }
            const request = this.database!
                .transaction([this.constructor.name], "readonly")
                .objectStore(this.constructor.name)
                .getAll();
            request.onerror = (event) => {
                reject();
            };
            request.onsuccess = (event) => {
                resolve(request.result);
            };
        });
    }

    async getById(id: string) {
        return new Promise(async (resolve, reject) => {
            if (!this.database) {
                await this.connection();
            }
            const request = this.database!
                .transaction([this.constructor.name], "readonly")
                .objectStore(this.constructor.name)
                .get(id);
            request.onerror = (event) => {
                reject();
            };
            request.onsuccess = (event) => {
                resolve(request.result);
            };
        });
    }

    async save() {
        return new Promise( async (resolve, reject) => {
            const metaData = MetaDataStorage.getInstance().getMetaData(this.constructor.name);
            if (!metaData) {
                reject();
            }
            if (!this.database) {
                await this.connection();
            }
            const save: any = {};
            Object.keys(this)
                .filter(key => metaData!.fields.includes(key))
                .forEach(key => save[key] = (this as any)[key]);
            // const record = {
            //     [metaData!.primaryKey!]: save[metaData!.primaryKey!],
            //     value: save
            // };

            console.log(save);
            const request = this.database!
                .transaction(this.constructor.name, "readwrite")
                .objectStore(this.constructor.name)
                .put(save);
            request.onerror = (event) => {
                reject();
            };
            request.onsuccess = (event) => {
                resolve();
            };
        });
    }

    async remove() {
        return new Promise( async (resolve, reject) => {
            if (!this.database) {
                await this.connection();
            }
            const key = MetaDataStorage.getInstance().getPrimaryKey(this.constructor.name);
            if (!key) {
                reject();
                return;
            }
            const id: string = (this as any)[key];
            const request = this.database!
                .transaction([this.constructor.name], "readwrite")
                .objectStore(this.constructor.name)
                .delete(id);
            request.onerror = (event) => {
                reject();
            };
            request.onsuccess = (event) => {
                resolve();
            };
        })
    }

    private async connection() {
        const request = await window.indexedDB.open(window.location.hostname);
        
        request.onerror = (event) => {
            this.storageType = StorageOption.MEMORY;
        }
        
        request.onupgradeneeded = (event: any /* IDBVersionChangeEvent */) => {
            // save the database
            const database: IDBDatabase = event.target.result;
            // create an object store for this database
            const tableName = this.constructor.name;
            const tableMetaData = MetaDataStorage.getInstance().getMetaData(tableName);
            MetaDataStorage.getInstance().print();
            if (tableMetaData === undefined) {
                throw new Error("No table found");
            }
            // create the table
            const objectStore = database!.createObjectStore(tableName, {
                keyPath: tableMetaData.primaryKey!,
                autoIncrement: false
            });
            
            // create the columns
            console.log(tableMetaData!.fields);
            console.log(tableMetaData);
            for (const field of tableMetaData!.fields) {
                if (field === tableMetaData!.primaryKey) {
                    continue;
                }
                objectStore.createIndex(field, field, {
                    unique: false
                });
            }
            // currently assuming everything went hunky dory
            // if this exits successfully, trigger onsuccess callback
        }

        request.onsuccess = (event: any) => {
            this.database = event.target.result;
        }
    } 
}

export function Table(version: number) {
    return function (target: Function) {
        MetaDataStorage.getInstance().addTable(target.name, version);
    }
}

export function Field(isPrimary: boolean = false) {
    return function (target: any, propertyName: string) {
        MetaDataStorage.getInstance().addField(target.constructor.name, propertyName, isPrimary);
    }
}