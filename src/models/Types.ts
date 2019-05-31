// TODO: Add best time for win
// TODO: Add worst time for win
// TODO: Add longest loss
export interface Statistics {
    gamesPlayed: number;
    wins: number;
    losses: number;
    incomplete: number;
    averageNumberOfMovesWin: number;
    averageNumberOfMovesLoss: number;
    averageNumberOfMovesTotal: number;
    averageTimeTakenLoss: number;
    averageTimeTakenWin: number;
    averageTimeTakenTotal: number;
    averageNumberOfInvisiblePieces: number;
}