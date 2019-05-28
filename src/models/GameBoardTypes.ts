export enum Visibility {
    INVISIBLE, // show default animation
    VISIBLE,   // show the cell value
    MARKED,    // show marked cell
}

export enum CellState {
    BOMB,  // cell is a bomb
    CLEAN, // cell is clean
}

export type CellValue = null | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Cell {
    hover: boolean;
    visibility: Visibility;
    readonly state: CellState;
    readonly value?: CellValue;
}
