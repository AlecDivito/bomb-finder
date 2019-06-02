

export default function RandInRange(min: number, max: number) {
    return Math.floor(Math.random() * max) + min;
}