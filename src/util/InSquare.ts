import { Point2d } from "../models/GameTypes";

export default function InSquare(square: {
    top: number,
    left: number,
    size: number,
}, point: Point2d): boolean {
    return point.y >= square.top && point.y <= square.top + square.size &&
        point.x >= square.left && point.x <= square.left + square.size
}