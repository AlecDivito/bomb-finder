export enum CellEvent {
    TOGGLE,
    MARK
}


export interface MouseEvent {
    pageX: number;
    pageY: number;
    localX: number;
    localY: number;
}

export interface MouseButtonEvent {
    left: boolean;
    middle: boolean;
    right: boolean;
    localX: number;
    localY: number;
}

export interface EventState {
    mouse?: MouseEvent;
    mouseButton?: MouseButtonEvent;
}


