export default function uuid() {
    const temp: any = [1e7];
    // eslint-disable-next-line
    return (temp + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
        // eslint-disable-next-line
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}