export enum Visibility {
    INVISIBLE, // show default animation
    VISIBLE,   // show the cell value
    VISIBLY_SATISFIED, // show the cell's value in diffrent color
    MARKED,    // show marked cell
}

export const isVisible = (v: Visibility) => 
    v === Visibility.VISIBLE || v === Visibility.VISIBLY_SATISFIED;

export const isMarkable = (v: Visibility) =>
    v === Visibility.MARKED || v === Visibility.INVISIBLE;

export const isMarked = (cell: Cell) => 
    cell.visibility === Visibility.MARKED;

export enum CellState {
    BOMB,  // cell is a bomb
    CLEAN, // cell is clean
}

export type CellValue = null | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const isBomb = (cv?: CellValue) => cv === null || cv === undefined;

export interface Cell {
    hover: boolean;
    visibility: Visibility;
    readonly state: CellState;
    readonly value?: CellValue;
}
