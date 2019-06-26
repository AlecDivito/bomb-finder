
type TableMetaData = {
    table: string,
    primaryKey?: string,
    fields: string[],
};

export class MetaDataStorage {

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

    public static getInstance() {
        return MetaDataStorage.instance ||
            (MetaDataStorage.instance = new MetaDataStorage());
    }

    public addTable(table: string) {
        const fields = this.tableQueue
            .filter(item => item.table === table)
            .map(item => item.field);
        const primaryKey = this.tableQueue
            .filter(item => item.primaryKey)
            .filter(item => item.table === table)[0].field;
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
}

enum StorageOption {
    INDEXDB,
    LOCAL_STORAGE,
    MEMORY,
} 

export class Query {

    private static instance: Query;
    private database?: IDBDatabase;
    private storageType: StorageOption;

    private constructor() {
        if (window.indexedDB) {
            this.storageType = StorageOption.INDEXDB;
        } else {
            this.storageType = StorageOption.MEMORY;
        }
    }

    private static Instance() {
        if (!Query.instance) {
            Query.instance = new Query();
        }
        return Query.instance;
    }

    static async save<T extends Object>(obj: T): Promise<boolean> {
        const query = Query.Instance();
        return new Promise(async (resolve, reject) => {
            if (!query.database) {
                await query.connection(obj.constructor.name);
            }
            let metaData = MetaDataStorage.getInstance().getMetaData(obj.constructor.name);
            if (!query.database!.objectStoreNames.contains(obj.constructor.name)) {
                // The database currently doesn't have our table in the database
                // increment the version and reopen the database
                await query.refreshDatabase(obj.constructor.name);
                metaData = MetaDataStorage.getInstance().getMetaData(obj.constructor.name);
            }
            
            const save: any = {};
            Object.keys(obj)
                .filter(key => metaData!.fields.includes(key))
                .forEach(key => save[key] = (obj as any)[key]);

            const request = query.database!
                .transaction(obj.constructor.name, "readwrite")
                .objectStore(obj.constructor.name)
                .put(save);
            request.onerror = (event) => {
                reject(false);
            };
            request.onsuccess = (event) => {
                resolve(true);
            };
        });
    }

    static async getAll<T extends Object>(type: T, filter?: (record: T) => boolean ): Promise<T[]> {
        const data: any = [];
        const query = Query.Instance();
        return new Promise(async (resolve, reject) => {
            if (!query.database) {
                await query.connection(type.constructor.name);
            }
            if (!query.database!.objectStoreNames.contains(type.constructor.name)) {
                resolve(data);
            }
            else {
                const request = query.database!
                    .transaction([type.constructor.name], "readonly")
                    .objectStore(type.constructor.name)
                    .openCursor();

                request.onerror = (event) => {
                    reject(data);
                };
                request.onsuccess = (event: Event) => {
                    let cursor = (event.target as IDBRequest).result;
                    if (cursor) {
                        if (!filter || (filter && filter(cursor.value))) {
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

    static async getById<T extends Object>(type: T, id: string | number): Promise<T> {
        const query = Query.Instance();
        return new Promise(async (resolve, reject) => {
            if (!query.database) {
                await query.connection(type.constructor.name);
            }
            if (!query.database!.objectStoreNames.contains(type.constructor.name)) {
                resolve(undefined);
            }
            else {
                const request = query.database!
                    .transaction([type.constructor.name], "readonly")
                    .objectStore(type.constructor.name)
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

    static async remove<T extends Object>(type: T): Promise<boolean> {
        const query = Query.Instance();
        return new Promise(async (resolve, reject) => {
            if (!query.database) {
                await query.connection(type.constructor.name);
            }
            const key = MetaDataStorage.getInstance().getPrimaryKey(type.constructor.name);
            if (!key) {
                reject(false);
                return;
            }
            const id: string = (type as any)[key];
            const request = query.database!
                .transaction([type.constructor.name], "readwrite")
                .objectStore(type.constructor.name)
                .delete(id);
            request.onerror = (event) => {
                reject(false);
            };
            request.onsuccess = (event) => {
                resolve(true);
            };
        })
    }

    private async connection(tableName: string, version?: number) {
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
                const tableMetaData = MetaDataStorage.getInstance().getMetaData(tableName);
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
                console.log(objectStore);
                // currently assuming everything went hunky dory
                // if this exits successfully, trigger onsuccess callback
            }

            request.onsuccess = (event: any) => {
                this.database = event.target.result;
                resolve();
            }
        });
    }

    private async refreshDatabase(tableName: string) {
        if (!this.database) {
            await this.connection(tableName);
        }
        const version = this.database!.version + 1;
        this.database!.close();
        await this.connection(tableName, version);
    }
}

export function Table() {
    return function (target: Function) {
        MetaDataStorage.getInstance().addTable(target.name);
    }
}

export function Field(isPrimary: boolean = false) {
    return function (target: any, propertyName: string) {
        MetaDataStorage.getInstance()
            .addField(target.constructor.name, propertyName, isPrimary);
    }
}
