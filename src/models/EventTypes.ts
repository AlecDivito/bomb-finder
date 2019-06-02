import { Point2d } from "./GameTypes";

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

export interface TouchEvent {
    // assume its always the first finger to touch the screen
    // identifier: Readonly<number>;
    pageX: number;
    pageY: number;
    localX: number;
    localY: number;
    radiusX: number;
    radiusY: number;
}

export interface EventState {
    mouse?: MouseEvent;
    mouseButton?: MouseButtonEvent;
    touch?: TouchEvent;
}

type Events = "mousedown" | "mouseup" | "mousemove" | "touch"

export interface SimpleEventState {
    leftClick: boolean;
    middleClick: boolean;
    rightClick: boolean;
    pos: Point2d;
    events: Array<Events>
}


