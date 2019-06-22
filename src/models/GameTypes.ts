export interface Point2d {
    x: number;
    y: number;
}

export enum GameStatus {
    GAME_PAUSED,
    GAME_PLAY,
}

export type GameDifficulty = "easy" | "medium" | "hard" | string;

export type GameProgress = "created" | "inprogress" | "lost" | "won";

