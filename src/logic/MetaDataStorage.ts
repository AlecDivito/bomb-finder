
type TableMetaData = {
    table: string,
    primaryKey?: string,
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

    public addTable(table: string) {
        const fields = this.tableQueue
            .filter(item => item.table === table)
            .map(item => item.field);
        const primaryKey = this.tableQueue.filter(item => item.primaryKey)[0].field;
        const record = { table, fields, primaryKey };
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
    }

    async getAll<T>( filter?: (record: T) => boolean ): Promise<T[]> {
        const data: any = [];
        return new Promise(async (resolve, reject) => {
            if (!this.database) {
                await this.connection();
            }
            if (!this.database!.objectStoreNames.contains(this.constructor.name)) {
                resolve(data);
            }
            else
            {
                const request = this.database!
                    .transaction([this.constructor.name], "readonly")
                    .objectStore(this.constructor.name)
                    .openCursor();
    
                request.onerror = (event) => {
                    reject(data);
                };
                request.onsuccess = (event: Event) => {
                    let cursor = (event.target as IDBRequest).result;
                    if (cursor) {
                        if (filter && filter(cursor.value)) {
                            data.push(cursor.value);
                        }
                        cursor.continue();
                    }
                    if (!cursor) {
                        resolve(data);
                    }
                };
            }
        });
    }

    async getById(id: string) {
        return new Promise(async (resolve, reject) => {
            if (!this.database) {
                await this.connection();
            }
            if (!this.database!.objectStoreNames.contains(this.constructor.name)) {
                resolve(undefined);
            }
            else {
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
            }
        });
    }

    async save() {
        return new Promise( async (resolve, reject) => {
            if (!this.database) {
                await this.connection();
            }
            let metaData = MetaDataStorage.getInstance().getMetaData(this.constructor.name);
            if (!this.database!.objectStoreNames.contains(this.constructor.name)) {
                // The database currently doesn't have our table in the database
                // increment the version and reopen the database
                await this.refreshDatabase();
                metaData = MetaDataStorage.getInstance().getMetaData(this.constructor.name);
            }
            const save: any = {};
            Object.keys(this)
                .filter(key => metaData!.fields.includes(key))
                .forEach(key => save[key] = (this as any)[key]);

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

    private async connection(version?: number) {
        const request = await window.indexedDB.open(window.location.hostname, version);
        return new Promise((resolve, reject) => {
            request.onerror = (event) => {
                this.storageType = StorageOption.MEMORY;
                reject();
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
                resolve();
            }
        });
    }

    private async refreshDatabase() {
        if (!this.database) {
            await this.connection();
        }
        const version = this.database!.version + 1;
        this.database!.close();
        await this.connection(version);
    }
}

export function Table() {
    return function (target: Function) {
        MetaDataStorage.getInstance().addTable(target.name);
    }
}

export function Field(isPrimary: boolean = false) {
    return function (target: any, propertyName: string) {
        MetaDataStorage.getInstance().addField(target.constructor.name, propertyName, isPrimary);
    }
}