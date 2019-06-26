import AnimationTimer, { LoopOptions } from "./Animation";
import { Cell, Visibility, isBomb, CellState, CellValue } from "../models/GameBoardTypes";

export interface CanvasWindow {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * All the renderer cares about is rendering
 * a piece of the board.
 * 
 * When drawing, you will pass in all the cell
 * details and it will be drawn
 */
export default class BombFinderPieceRenderer {

    // TODO: Add more off screen canvas updating
    private offscreenCanvas: HTMLCanvasElement = document.createElement("canvas");
    private pieceAnimations: AnimationTimer[] = [];

    private canvasWindow?: CanvasWindow;

    private pieceLength: number;
    private gapSize: number;
    private simpleRender: boolean;

    private readonly exampleCell = {
        hover: false,
        visibility: Visibility.VISIBLE,
        state: CellState.CLEAN,
        value: 2 as CellValue,
    };

    constructor(pieceLength: number, gapSize: number, spinningCubes: number,
        simpleRender: boolean = false) {
        this.pieceLength = pieceLength;
        this.gapSize = gapSize;
        this.simpleRender = simpleRender;
        this.setCellSize(pieceLength);
        this.setSpinningCubes(spinningCubes);
    }

    setCellSize(value: number) {
        this.pieceLength = value;
        this.offscreenCanvas.height = value;
        this.offscreenCanvas.width = value;
    }

    setGapSize(value: number) {
        this.gapSize = value;
    }

    setSpinningCubes(value: number) {
        this.pieceAnimations = [];
        for (let i = value + 1; i >= 1; i--) {
            this.pieceAnimations.push(
                new AnimationTimer(90 * i, Math.pow(i + 1, i * .035) - 1, LoopOptions.ALTERNATE));
        }
    }

    setSimpleRender(value: boolean) {
        this.simpleRender = value;
    }

    update(delta: number, canvasWindow?: CanvasWindow) {
        this.canvasWindow = canvasWindow;
        if (this.simpleRender) {
            return;
        }
        for (let i = 0; i < this.pieceAnimations.length; i++) {
            this.pieceAnimations[i].update(delta);
        }
        this.offscreenCanvas.getContext('2d')!.clearRect(0, 0, this.pieceLength, this.pieceLength);
        this.drawInvisiblePiece(this.offscreenCanvas.getContext('2d')!, 0, 0);
    }

    drawPlaceHolder(ctx: CanvasRenderingContext2D, x: number, y: number,
        visibility: Visibility = Visibility.INVISIBLE) {
        ctx.save();
        switch (visibility) {
            case Visibility.INVISIBLE: this.drawInvisiblePiece(ctx, x, y); break;
            case Visibility.MARKED: this.drawInvisiblePiece(ctx, x, y, "#3396ff"); break;
            case Visibility.VISIBLE: this.drawVisibleCell(ctx, x, y, this.exampleCell); break;
            case Visibility.VISIBLY_SATISFIED:
                this.drawVisibleCell(ctx, x, y, this.exampleCell, "#3396ff"); break;
        }
        ctx.restore();
    }

    drawPiece(ctx: CanvasRenderingContext2D, cell: Cell, x: number, y: number) {
        // piece isn't even visible, don't render it
        if (this.canvasWindow
                && (x + this.pieceLength < this.canvasWindow.x // left
                || x > this.canvasWindow.x + this.canvasWindow.width
                || y + this.pieceLength < this.canvasWindow.y
                || y > this.canvasWindow.y + this.canvasWindow.height)
        ) {
            return
        } 

        if (cell.visibility === Visibility.INVISIBLE) {
            // this.drawInvisiblePiece(ctx, x, y);
            ctx.drawImage(this.offscreenCanvas, x, y);
            if (cell.hover) {
                this.drawHover(ctx, x, y);
            }
        } else if (cell.visibility === Visibility.MARKED) {
            this.drawInvisiblePiece(ctx, x, y, "#3396ff");
        } else if (cell.visibility === Visibility.VISIBLE) {
            this.drawVisibleCell(ctx, x, y, cell);
        } else if (cell.visibility === Visibility.VISIBLY_SATISFIED) {
            this.drawVisibleCell(ctx, x, y, cell, "#3396ff");
        }
    }

    private drawInvisiblePiece(ctx: CanvasRenderingContext2D, x: number, y: number, overrideColor?: string) {
        ctx.save();
        ctx.beginPath();
        if (overrideColor) {
            ctx.strokeStyle = overrideColor;
        } else {
            ctx.strokeStyle = "#FFF";
        }
        this.drawRectangle(ctx, x, y, this.pieceLength / 8, this.pieceLength);

        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        if (this.simpleRender) {
            return;
        }
        // const radius = 1;
        // this.drawCirlce(ctx, x + (length / 2) - (radius / 2), y + (length / 2) - (radius / 2), radius, overrideColor);

        ctx.save();
        let s = this.pieceLength;
        let jump = 0;
        for (let i = 1; i < this.pieceAnimations.length; i++) {
            const rotation = (i % 2 === 0) ? 1 : -1;
            this.drawRotatingSquare(ctx, jump + x, jump + y, s, i, rotation, overrideColor);
            jump += (s / 4) / 2;
            s = (s / 4) * 3;
        }
        ctx.restore();
    }

    private drawRotatingSquare(ctx: CanvasRenderingContext2D, worldX: number, worldY: number, cellLength: number,
        i: number, rotationDirection: 1 | -1, overrideColor?: string) {
        const radius = cellLength / 8;
        let totalLength = cellLength / 2 + (radius * 2);
        let x = worldX + cellLength / 4 - (radius);
        let y = worldY + cellLength / 4 - (radius);

        ctx.save();
        ctx.beginPath();
        // Draw the rotating bits inside of the circle
        ctx.translate(x + totalLength / 2, y + totalLength / 2);
        ctx.rotate(this.pieceAnimations[i].getValue() *  Math.PI / 180);
        ctx.translate((x + totalLength / 2) * -1, (y + totalLength / 2) * -1);
        this.drawRectangle(ctx, x, y, radius, totalLength);
        ctx.lineWidth = 2;
        if (overrideColor) {
            ctx.strokeStyle = overrideColor;
        } else {
            ctx.strokeStyle = "gray";
        }

        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, length: number) {
        // start
        ctx.moveTo(x + radius, y);
        // top
        ctx.lineTo(x + length - radius, y);
        ctx.quadraticCurveTo(x + length, y, x + length, y + radius);
        // right
        ctx.lineTo(x + length, y + length - radius);
        ctx.quadraticCurveTo(x + length, y + length, x + length - radius, y + length);
        // bottom
        ctx.lineTo(x + radius, y + length);
        ctx.quadraticCurveTo(x, y + length, x, y + length - radius);
        // left
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    }
    
    private drawHover(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.save()
        let alpha = 1.0;
        for (let i = 1; i <= (this.gapSize / 2); i++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255, ${alpha})`;
            this.drawRectangle(ctx, x - i, y - i, (this.pieceLength) / 8,
                this.pieceLength + (i * 2));
            if ((i + 1) >= (this.gapSize / 2)) {
                ctx.lineWidth = 1;
            } else {
                ctx.lineWidth = 2;
            }
            alpha -= 0.1;
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    }

    private drawVisibleCell(ctx: CanvasRenderingContext2D, x: number, y: number, cell: Cell, overrideColor?: string) {
        ctx.save();
        ctx.beginPath();
        let length = this.pieceLength;
        if (isBomb(cell.value)) {
            // let radius = 3;
            // draw the outline of the shape
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + length / 2, y + length / 2, length / 2, 0, 2 * Math.PI);
            ctx.strokeStyle = "#690721";
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            // draw inner circle
            ctx.save();
            ctx.beginPath();
            length -= 6;
            ctx.arc(x + 3 + length / 2, y + 3 + length / 2, length / 2, 0, 2 * Math.PI);
            ctx.strokeStyle = "#f00f4b";
            ctx.lineWidth = 3;
            // gradient 

            const innerX = x + (length / 2);
            const innerY = y + (length / 2);
            var gradient = ctx.createRadialGradient(
                innerX, innerY, this.pieceLength / 6,
                innerX, innerY, this.pieceLength / 2);

            // Add three color stops
            gradient.addColorStop(0, '#333');
            gradient.addColorStop(1, '#690721');

            // fill shap
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();

        } else if (cell.value === 0) {
            this.drawRectangle(ctx, x, y, this.pieceLength / 8, this.pieceLength);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "gray";
        } else {
            if (overrideColor) {
                ctx.fillStyle = overrideColor;
                ctx.strokeStyle = overrideColor;
            } else {
                ctx.fillStyle = "#FFFFFF";
                ctx.strokeStyle = "#FFFFFF"
            }
            // http://www.ckollars.org/canvas-text-centering.html
            ctx.font = `normal ${this.pieceLength}px sans-serif`;
            // const measurements = ctx.measureText(String(cell.value));
            const offset = (this.pieceLength / 2) + 2;
            const ypos = y + (this.pieceLength / 2) + offset;// + this.pieceLength;
            const xpos = x + (this.pieceLength / 2);
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.arc(x + length / 2, y + length / 2, length / 2, 0, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.fillText(String(cell.value), xpos, ypos);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    private drawCirlce(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, overrideColor?: string) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + radius / 2, y + radius / 2, radius, 0, 2 * Math.PI);
        if (overrideColor) {
            ctx.strokeStyle = overrideColor;
        } else {
            ctx.strokeStyle = "#FFF";
        }
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}