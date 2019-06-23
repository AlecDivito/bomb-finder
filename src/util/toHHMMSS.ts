export default function toHHMMSS(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (minutes * 60);
    let timeString = "";

    if (hours > 0) {
        timeString += (hours < 10) ? `0${hours}` : `${hours}`;
    }
    timeString += (minutes < 10) ? `0${minutes}:` : `${minutes}:`;
    timeString += (seconds < 10) ? `0${seconds}` : `${seconds}`;

    return timeString;
}