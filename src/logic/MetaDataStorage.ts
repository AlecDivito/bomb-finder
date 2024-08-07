import { isObject } from "util";

type TableMetaData = {
  table: string;
  primaryKey?: string;
  fields: string[];
};

export class MetaDataStorage {
  private static instance: MetaDataStorage;

  private storage: Array<TableMetaData>;

  private tableQueue: Array<{
    primaryKey: boolean;
    table: string;
    field: string;
  }>;

  private constructor() {
    this.storage = [];
    this.tableQueue = [];
  }

  public static getInstance() {
    return (
      MetaDataStorage.instance ||
      (MetaDataStorage.instance = new MetaDataStorage())
    );
  }

  public addTable(table: string) {
    const fields = this.tableQueue
      .filter((item) => item.table === table)
      .map((item) => item.field);
    const keys = this.tableQueue
      .filter((item) => item.primaryKey)
      .filter((item) => item.table === table);
    let primaryKey = undefined;
    if (keys[0]) {
      primaryKey = keys[0].field;
    }
    const record = { table, fields, primaryKey };
    this.storage.push(record);
  }

  public addField(table: string, field: string, isPrimary: boolean) {
    const item = this.storage.find((o) => o.table === table);
    if (item !== undefined) {
      item.fields.push(field);
    } else {
      this.tableQueue.push({ table, field, primaryKey: isPrimary });
    }
  }

  public getPrimaryKey(table: string): string | undefined {
    const metaData = this.storage.find((s) => s.table === table);
    if (!metaData) {
      return undefined;
    }
    if (!metaData.primaryKey) {
      return undefined;
    }
    return metaData.primaryKey;
  }

  public getMetaData(table: string): TableMetaData | undefined {
    return this.storage.find((s) => s.table === table);
  }
}

enum StorageOption {
  INDEXDB,
  MEMORY,
}

export interface IDBTable {
  tableName: string;
  id: string;
}

export class Query {
  private static instance: Query;
  private static storageType: StorageOption;
  private static memoryDb: any = {};
  private database?: IDBDatabase;

  private constructor() {
    if (window.indexedDB) {
      Query.storageType = StorageOption.INDEXDB;
    } else {
      Query.storageType = StorageOption.MEMORY;
    }
  }

  private static Instance() {
    if (!Query.instance) {
      Query.instance = new Query();
    }
    return Query.instance;
  }

  static sanitizeId(id: string) {
    return id.replace(" ", "_").toLocaleLowerCase();
  }

  // TODO: object should extend an object with id garenteed on the object
  //       that way we can sanitize the id
  //       There should be sanitization for every id
  static async save<T extends IDBTable>(obj: T): Promise<boolean> {
    if (Query.storageType === StorageOption.MEMORY) {
      if (!isObject(Query.memoryDb[obj.tableName])) {
        Query.memoryDb[obj.tableName] = {};
      }
      Query.memoryDb[obj.tableName][obj.id] = obj;
      return true;
    }
    const query = Query.Instance();
    return new Promise(async (resolve, reject) => {
      if (!query.database) {
        await query.connection(obj.tableName);
      }
      let metaData = MetaDataStorage.getInstance().getMetaData(obj.tableName);
      if (!query.database!.objectStoreNames.contains(obj.tableName)) {
        // The database currently doesn't have our table in the database
        // increment the version and reopen the database
        await query.refreshDatabase(obj.tableName);
        metaData = MetaDataStorage.getInstance().getMetaData(obj.tableName);
      }

      const save: any = {};
      Object.keys(obj)
        .filter((key) => metaData!.fields.includes(key))
        .forEach((key) => (save[key] = (obj as any)[key]));

      const request = query
        .database!.transaction(obj.tableName, "readwrite")
        .objectStore(obj.tableName)
        .put(save);
      request.onerror = (event) => {
        reject(false);
      };
      request.onsuccess = (event) => {
        resolve(true);
      };
    });
  }

  static async getAll<T extends IDBTable>(
    type: T,
    filter?: (record: T) => boolean
  ): Promise<T[]> {
    const data: any = [];
    if (Query.storageType === StorageOption.MEMORY) {
      if (!isObject(Query.memoryDb[type.tableName])) {
        return data;
      }
      return Object.keys(Query.memoryDb[type.tableName])
        .map((id) => Query.memoryDb[type.tableName][id])
        .filter((t) => (filter ? filter(t) : true));
    }
    const query = Query.Instance();
    return new Promise(async (resolve, reject) => {
      if (!query.database) {
        await query.connection(type.tableName);
      }
      if (!query.database!.objectStoreNames.contains(type.tableName)) {
        resolve(data);
      } else {
        const request = query
          .database!.transaction([type.tableName], "readonly")
          .objectStore(type.tableName)
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

  static async getById<T extends IDBTable>(
    type: T,
    id: string
  ): Promise<T | undefined> {
    if (Query.storageType === StorageOption.MEMORY) {
      if (!isObject(Query.memoryDb[type.tableName])) {
        return undefined;
      }
      return Query.memoryDb[type.tableName][id];
    }
    const query = Query.Instance();
    return new Promise(async (resolve, reject) => {
      if (!query.database) {
        await query.connection(type.tableName);
      }
      if (!query.database!.objectStoreNames.contains(type.tableName)) {
        resolve(undefined);
      } else {
        const request = query
          .database!.transaction([type.tableName], "readonly")
          .objectStore(type.tableName)
          .get(id);
        request.onerror = (event) => {
          reject(undefined);
        };
        request.onsuccess = (event) => {
          resolve(request.result);
        };
      }
    });
  }

  static async remove<T extends IDBTable>(type: T): Promise<boolean> {
    if (Query.storageType === StorageOption.MEMORY) {
      if (!isObject(Query.memoryDb[type.tableName])) {
        return true;
      }
      if (isObject(Query.memoryDb[type.tableName][type.id])) {
        delete Query.memoryDb[type.tableName][type.id];
      }
      return true;
    }
    const query = Query.Instance();
    return new Promise(async (resolve, reject) => {
      if (!query.database) {
        await query.connection(type.tableName);
      }
      const key = MetaDataStorage.getInstance().getPrimaryKey(type.tableName);
      if (!key) {
        reject(false);
        return;
      }
      const id: string = (type as any)[key];
      const request = query
        .database!.transaction([type.tableName], "readwrite")
        .objectStore(type.tableName)
        .delete(id);
      request.onerror = (event) => {
        reject(false);
      };
      request.onsuccess = (event) => {
        resolve(true);
      };
    });
  }

  private async connection(tableName: string, version?: number) {
    const request = await window.indexedDB.open(
      window.location.hostname,
      version
    );
    return new Promise((resolve, reject) => {
      request.onerror = (event) => {
        Query.storageType = StorageOption.MEMORY;
        reject();
      };

      request.onupgradeneeded = (event: any /* IDBVersionChangeEvent */) => {
        // save the database
        const database: IDBDatabase = event.target.result;
        // create an object store for this database
        const tableMetaData =
          MetaDataStorage.getInstance().getMetaData(tableName);
        if (tableMetaData === undefined) {
          throw new Error("No table found");
        }
        // create the table
        const objectStore = database!.createObjectStore(tableName, {
          keyPath: tableMetaData.primaryKey!,
          autoIncrement: false,
        });

        // create the columns
        for (const field of tableMetaData!.fields) {
          if (field === tableMetaData!.primaryKey) {
            continue;
          }
          objectStore.createIndex(field, field, {
            unique: false,
          });
        }
        // currently assuming everything went hunky dory
        // if this exits successfully, trigger onsuccess callback
      };

      request.onsuccess = (event: any) => {
        this.database = event.target.result;
        resolve(undefined);
      };
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

export function Table(name: string) {
  return function (target: Function) {
    MetaDataStorage.getInstance().addTable(name);
  };
}

export function Field(tableName: string, isPrimary: boolean = false) {
  return function (target: any, propertyName: string) {
    MetaDataStorage.getInstance().addField(tableName, propertyName, isPrimary);
  };
}
