export interface Point2d {
    x: number;
    y: number;
}

export enum GameStatus {
    GAME_PAUSED,
    GAME_PLAY,
    GAME_LOSE,
    GAME_WON,
}

export type GameDifficulty = "easy" | "medium" | "hard" | "custom";

export type GameProgress = "created" | "inprogress" | "lost" | "won";

