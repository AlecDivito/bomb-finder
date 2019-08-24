import AnimationTimer, { LoopOptions } from "./Animation";
import { Cell, Visibility, isBomb, CellValue } from "../models/GameBoardTypes";
import RandInRange from "../util/Random";
import { IPreferences } from "../models/Preferences";

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

    /**
     * Invisible
     * Invisible Marked
     * 0 cell
     * bomb cell
     * 1-8 cells
     * 1-8 cells satisfied
     */
    // the offsreen canvas can be this.pieceLength * 20 by this.pieceLength
    // then when we are drawing we just grab the offset
    // why not 3 diffrent canvases, animated get there own

    // TODO: Add more off screen canvas updating
    private invisiblePieceCanvas: HTMLCanvasElement;
    private invisibleMarkedPieceCanvas: HTMLCanvasElement;
    private staticPieceCanvas: HTMLCanvasElement[] = [];
    private pieceAnimations: AnimationTimer[] = [];

    private pieceLength: number;
    private gapSize: number;
    private simpleRender: boolean;
    private exampleCellValue = RandInRange(0, 8);

    constructor(settings: IPreferences) {
        this.pieceLength = settings.defaultCellSize;
        this.gapSize = settings.gridGapSize;
        this.simpleRender = settings.simpleRender;
        this.setSpinningCubes(settings.spinningCubes);
        // set up canvas
        this.invisiblePieceCanvas = document.createElement("canvas");
        this.invisiblePieceCanvas.height = this.pieceLength + 2;
        this.invisiblePieceCanvas.width = this.pieceLength + 2;
        this.drawInvisiblePiece(this.invisiblePieceCanvas.getContext('2d')!, 1, 1);
        this.invisibleMarkedPieceCanvas = document.createElement("canvas");
        this.invisibleMarkedPieceCanvas.height = this.pieceLength + 2;
        this.invisibleMarkedPieceCanvas.width = this.pieceLength + 2;
        this.drawInvisiblePiece(this.invisibleMarkedPieceCanvas.getContext('2d')!, 1, 1, "#3396ff");
        for (let i = 0; i < 18; i++) {
            this.staticPieceCanvas[i] = document.createElement("canvas");
            this.staticPieceCanvas[i].width = this.pieceLength + 2;
            this.staticPieceCanvas[i].height = this.pieceLength + 2;
            const ctx = this.staticPieceCanvas[i].getContext('2d')!;
            if (i < 8) {
                this.drawVisibleCell(ctx, 1, 1.5, (i + 1 as CellValue));
            } else if (i < 16) {
                const num: CellValue = (i % 8) + 1 as CellValue;
                this.drawVisibleCell(ctx, 1, 1.5, num, "#3396ff");
            } else if (i < 17) {
                this.drawVisibleCell(ctx, 1, 1.5, 0);
            } else {
                this.drawVisibleCell(ctx, 1, 1.5, undefined);
            }
        }
    }

    setCellSize(value: number) {
        this.pieceLength = value;
        // hard code invis
        this.invisiblePieceCanvas.height = value;
        this.invisiblePieceCanvas.width = value;
        // marked invis
        this.invisibleMarkedPieceCanvas.height = value;
        this.invisibleMarkedPieceCanvas.width = value;
        // everything else
        for (let i = 0; i < 18; i++) {
            this.staticPieceCanvas[i].width = value;
            this.staticPieceCanvas[i].height = value;
            const ctx = this.staticPieceCanvas[i].getContext('2d')!;
            if (i < 8) {
                this.drawVisibleCell(ctx, 0, 0, (i + 1 as CellValue));
            } else if (i < 16) {
                const num: CellValue = (i % 8) + 1 as CellValue;
                this.drawVisibleCell(ctx, 0, 0, num, "#3396ff");
            } else if (i < 17) {
                this.drawVisibleCell(ctx, 0, 0, 0);
            } else {
                this.drawVisibleCell(ctx, 0, 0, undefined);
            }
        }
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

    update(delta: number) {
        if (this.simpleRender) {
            return;
        }
        for (let i = 0; i < this.pieceAnimations.length; i++) {
            this.pieceAnimations[i].update(delta);
        }
        // get context
        const ipcContext = this.invisiblePieceCanvas.getContext('2d')!;
        const impcContext = this.invisibleMarkedPieceCanvas.getContext('2d')!;
        // clear canvas
        ipcContext.clearRect(0, 0, this.pieceLength, this.pieceLength);
        impcContext.clearRect(0, 0, this.pieceLength, this.pieceLength);
        // draw canvas
        this.drawInvisiblePiece(ipcContext, 1, 1);
        this.drawInvisiblePiece(impcContext, 1, 1, "#3396ff");
    }

    drawPlaceHolder(ctx: CanvasRenderingContext2D, x: number, y: number, visibility: Visibility = Visibility.INVISIBLE) {
        ctx.save();
        switch (visibility) {
            case Visibility.INVISIBLE: this.drawInvisiblePiece(ctx, x, y); break;
            case Visibility.MARKED: this.drawInvisiblePiece(ctx, x, y, "#3396ff"); break;
            case Visibility.VISIBLE: this.drawVisibleCell(ctx, x, y, this.exampleCellValue as CellValue); break;
            case Visibility.VISIBLY_SATISFIED:
                this.drawVisibleCell(ctx, x, y, this.exampleCellValue as CellValue, "#3396ff"); break;
        }
        ctx.restore();
    }

    drawPiece(ctx: CanvasRenderingContext2D, cell: Cell, x: number, y: number) {
        if (cell.visibility === Visibility.INVISIBLE) {
            ctx.drawImage(this.invisiblePieceCanvas, x, y);
            if (cell.hover) {
                this.drawHover(ctx, x + 1, y + 1);
                // add this as a debug feature cause its actually cool
                // const index = this.getIndexByCell(cell);
                // ctx.drawImage(this.staticPieceCanvas[index], x, y);
            }
        } else if (cell.visibility === Visibility.MARKED) {
            ctx.drawImage(this.invisibleMarkedPieceCanvas, x, y);
        } else {
            const index = this.getIndexByCell(cell);
            ctx.drawImage(this.staticPieceCanvas[index], x, y);
        }
    }

    private getIndexByCell(cell: Cell) {
        if (isBomb(cell.value)) {
            return 17;
        } else if (cell.value === 0) {
            return 16;
        } else {
            if (cell.visibility === Visibility.VISIBLY_SATISFIED) {
                return cell.value! - 1 + 8;
            }
            return cell.value! - 1;
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

    private drawVisibleCell(ctx: CanvasRenderingContext2D, x: number, y: number, cellValue?: CellValue, overrideColor?: string) {
        ctx.save();
        ctx.beginPath();
        let length = this.pieceLength;
        if (isBomb(cellValue)) {
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

        } else if (cellValue === 0) {
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
            ctx.fillText(String(cellValue), xpos, ypos);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}