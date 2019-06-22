
export function isObjectEmpty(obj: object) {
    if (obj === null) {
        return true;
    }
    for (let key in obj) {
        if (Object.getOwnPropertyNames(obj).includes(key)) {
            return false;
        }
    }
    return true;
}