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

export const incrementCellValue = (value?: CellValue): CellValue => {
    switch (value) {
        case 0: return 1;
        case 1: return 2;
        case 2: return 3;
        case 3: return 4;
        case 4: return 5;
        case 5: return 6;
        case 6: return 7;
        case 7: return 8;
        // these last 2 cases should rarely be called
        case 8: return 8;
        default: return null
    }
}

export const isBomb = (cv?: CellValue) => cv === null || cv === undefined;

export interface Cell {
    hover: boolean;
    visibility: Visibility;
    readonly state: CellState;
    readonly value?: CellValue;
}
