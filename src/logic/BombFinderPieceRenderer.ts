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
     * Constants
     */
    private readonly RECTANGLE_REDIS_DEGREE = 6;
    private readonly LINE_WIDTH_DEGREE = 20;
    private readonly ROTATING_LINE_WIDTH_DEGREE = 60;
    private readonly PIECE_MARKED_COLOR = "#3396ff";

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
    // private pieceAnimations: AnimationTimer[] = [];
    private pieceAnimations: number[] = [];

    private lineWidth: number;
    private pieceLength: number;
    private gapSize: number;
    private simpleRender: boolean;
    private exampleCellValue = RandInRange(0, 8);

    constructor(settings: IPreferences) {
        this.lineWidth = settings.defaultCellSize / this.LINE_WIDTH_DEGREE;
        this.pieceLength = settings.defaultCellSize - this.lineWidth * 2;
        this.gapSize = settings.gridGapSize;
        this.simpleRender = settings.simpleRender;
        this.setSpinningCubes(settings.spinningCubes);
        // set up canvas
        this.invisiblePieceCanvas = document.createElement("canvas");
        this.invisiblePieceCanvas.height = settings.defaultCellSize;
        this.invisiblePieceCanvas.width =  settings.defaultCellSize;
        this.drawInvisiblePiece(this.invisiblePieceCanvas.getContext('2d')!, this.lineWidth, this.lineWidth);

        this.invisibleMarkedPieceCanvas = document.createElement("canvas");
        this.invisibleMarkedPieceCanvas.height = settings.defaultCellSize;
        this.invisibleMarkedPieceCanvas.width = settings.defaultCellSize;
        this.drawInvisiblePiece(this.invisibleMarkedPieceCanvas.getContext('2d')!, this.lineWidth, this.lineWidth, this.PIECE_MARKED_COLOR);

        for (let i = 0; i < 18; i++) {
            this.staticPieceCanvas[i] = document.createElement("canvas");
            this.staticPieceCanvas[i].width = settings.defaultCellSize;
            this.staticPieceCanvas[i].height = settings.defaultCellSize;
            const ctx = this.staticPieceCanvas[i].getContext('2d')!;
            if (i < 8) {
                this.drawVisibleCell(ctx, this.lineWidth, this.lineWidth, (i + 1 as CellValue));
            } else if (i < 16) {
                const num: CellValue = (i % 8) + 1 as CellValue;
                this.drawVisibleCell(ctx, this.lineWidth, this.lineWidth, num, this.PIECE_MARKED_COLOR);
            } else if (i < 17) {
                this.drawVisibleCell(ctx, this.lineWidth, this.lineWidth, 0);
            } else {
                this.drawVisibleCell(ctx, this.lineWidth, this.lineWidth, undefined);
            }
        }
    }

    /**
     * Update the size of a cells width and height
     * @param value height and width to set the piece
     */
    setCellSize(value: number) {
        this.lineWidth = value / this.LINE_WIDTH_DEGREE;
        this.pieceLength = value - this.lineWidth * 2;
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
                this.drawVisibleCell(ctx, 0, 0, num, this.PIECE_MARKED_COLOR);
            } else if (i < 17) {
                this.drawVisibleCell(ctx, 0, 0, 0);
            } else {
                this.drawVisibleCell(ctx, 0, 0, undefined);
            }
        }
    }

    /**
     * Set the gab size found between pieces
     * @param value size of gap in pixels
     */
    setGapSize(value: number) {
        this.gapSize = value;
    }

    /**
     * Set the number of cubes that spin inside of invisible pieces
     * @param value number of spinning cubes found on invisible pieces
     */
    setSpinningCubes(value: number) {
        this.pieceAnimations = [];
        for (let i = value + 1; i >= 1; i--) {
            this.pieceAnimations.push(0);
                // new AnimationTimer(90 * i, Math.pow(i + 1, i * .035) - 1, LoopOptions.ALTERNATE));
        }
    }

    /**
     * Toggle simple render option
     * @param value property to toggle simple render to
     */
    setSimpleRender(value: boolean) {
        this.simpleRender = value;
    }

    private reverseTiming: boolean = false;
    /**
     * Update dynamic pieces (spinning cubes)
     * return early if simple render is on
     * @param delta elapsed seconds
     */
    update(delta: number) {
        if (this.simpleRender || this.pieceAnimations.length === 0) {
            return;
        }
        let reverse: boolean[] = [];
        for (let i = 0; i < this.pieceAnimations.length; i++) {
            let index = i;
            if (this.reverseTiming) {
                index = this.pieceAnimations.length - i;
            }
            const oldTime = this.pieceAnimations[index]
            const newTime = this.pieceAnimations[index] + (delta * (index) * 1);
            if (this.reverseTiming) {
                if (Math.sin(newTime) < Math.sin(oldTime)) {
                    this.pieceAnimations[index] = newTime;
                    reverse.push(false);
                } else {
                    reverse.push(true);
                }
            } else {
                if (Math.sin(newTime) > Math.sin(oldTime)) {
                    this.pieceAnimations[index] = newTime;
                    reverse.push(true);
                } else {
                    reverse.push(false);
                }
            }
        }
        const allSame = reverse.every(b => b === reverse[0]);
        if (allSame) {
            this.reverseTiming = !this.reverseTiming;
        }

        // get context
        const ipcContext = this.invisiblePieceCanvas.getContext('2d')!;
        const impcContext = this.invisibleMarkedPieceCanvas.getContext('2d')!;
        // clear canvas
        const length = this.pieceLength + (this.lineWidth * 2)
        ipcContext.clearRect(0, 0, length, length);
        impcContext.clearRect(0, 0, length, length);
        // draw canvas
        this.drawInvisiblePiece(ipcContext, this.lineWidth, this.lineWidth);
        this.drawInvisiblePiece(impcContext, this.lineWidth, this.lineWidth, this.PIECE_MARKED_COLOR);
    }

    /**
     * Create graphical gird cell without actually providing one
     * @param ctx canvas context
     * @param x x position
     * @param y y position
     * @param visibility Cell visibility
     */
    drawPlaceHolder(ctx: CanvasRenderingContext2D, x: number, y: number, visibility: Visibility = Visibility.INVISIBLE) {
        ctx.save();
        switch (visibility) {
            case Visibility.INVISIBLE: this.drawInvisiblePiece(ctx, x, y); break;
            case Visibility.MARKED: this.drawInvisiblePiece(ctx, x, y, this.PIECE_MARKED_COLOR); break;
            case Visibility.VISIBLE: this.drawVisibleCell(ctx, x, y, this.exampleCellValue as CellValue); break;
            case Visibility.VISIBLY_SATISFIED:
                this.drawVisibleCell(ctx, x, y, this.exampleCellValue as CellValue, this.PIECE_MARKED_COLOR); break;
        }
        ctx.restore();
    }

    /**
     * Create graphical grid cell
     * @param ctx canvas
     * @param cell grid cell
     * @param x x position
     * @param y y position
     */
    drawPiece(ctx: CanvasRenderingContext2D, cell: Cell, x: number, y: number) {
        if (cell.visibility === Visibility.INVISIBLE) {
            ctx.drawImage(this.invisiblePieceCanvas, x, y);
            if (cell.hover) {
                const offset = this.lineWidth / 2;
                this.drawHover(ctx, x + offset, y + offset);
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

    /**
     * get the index of the cached canvas that matches the cell's state
     * @param cell Cell
     */
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

    /**
     * Draw an invisible piece
     * @param ctx canvas
     * @param x x position
     * @param y y pixel position
     * @param overrideColor color to use instead of default color (#FFF)
     */
    private drawInvisiblePiece(ctx: CanvasRenderingContext2D, x: number, y: number, overrideColor?: string) {
        if (!this.simpleRender) {
            ctx.save();
            let s = this.pieceLength * 0.9;
            let offset = this.pieceLength * 0.05;
            for (let i = 1; i < this.pieceAnimations.length + 1; i++) {
                const rotation =Math.sin(this.pieceAnimations[i]);
                let index = this.pieceAnimations.length - 1;
                s += rotation * Math.pow(index, 0.25);
                offset += (rotation * -Math.pow(index, 0.25)) / 2;
                this.drawRotatingSquare(ctx, offset + x, y + offset, s, i, rotation, overrideColor);
                offset += (s / 4) / 2;
                s = (s / 4) * 3;
            } 
            ctx.restore();
        }
        

        ctx.save();
        ctx.beginPath();
        if (overrideColor) {
            ctx.strokeStyle = overrideColor;
        } else {
            ctx.strokeStyle = "#FFF";
        }
        this.drawSquare(ctx, x, y, this.pieceLength / this.RECTANGLE_REDIS_DEGREE, this.pieceLength);

        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    /**
     * Draw one rotating cube
     * @param ctx canvas
     * @param worldX x pixel position
     * @param worldY y pixel position
     * @param cellLength spinning cube width
     * @param i index
     * @param rotationDirection direction to rotate
     * @param overrideColor color to use instead of default color (#FFF)
     */
    private drawRotatingSquare(ctx: CanvasRenderingContext2D, worldX: number, worldY: number, cellLength: number,
        i: number, rotation: number, overrideColor?: string) {
        const radius = cellLength / this.RECTANGLE_REDIS_DEGREE;
        let totalLength = cellLength / 2 + (radius * 2);
        let x = worldX + cellLength / 4 - radius;
        let y = worldY + cellLength / 4 - radius;

        ctx.save();
        ctx.beginPath();
        // Draw the rotating bits inside of the circle
        ctx.translate(x + + (totalLength / 2), y + totalLength / 2);
        ctx.rotate(rotation);
        ctx.translate((x + totalLength / 2) * -1, (y + totalLength / 2) * -1);
        this.drawSquare(ctx, x, y, radius, totalLength);
        let lineWidth = this.pieceLength / this.ROTATING_LINE_WIDTH_DEGREE;
        if (lineWidth < 1) {
            lineWidth = 1;
        }
        ctx.lineWidth = lineWidth;
        if (overrideColor) {
            ctx.strokeStyle = overrideColor;
        } else {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        }

        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draw a square on the canvas
     * @param ctx canvas
     * @param x x pixel position
     * @param y y pixel position
     * @param radius border radius
     * @param length width and height of rectangle
     */
    private drawSquare(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, length: number) {
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
    
    /**
     * Draw multiple squares at different alpha values to give the appearance of 
     * a gradient
     * @param ctx canvas
     * @param x x pixel position
     * @param y y pixel position
     */
    private drawHover(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.save()
        const gapSize = (this.gapSize / 2)
        let alpha = 1.0;
        let step = 1 / gapSize;
        x += (1 + this.lineWidth) / 2;
        y += (1 + this.lineWidth) / 2;
        for (let i = 1; i <= gapSize; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255, ${alpha})`;
            this.drawSquare(ctx, x - i, y - i, (this.pieceLength) / this.RECTANGLE_REDIS_DEGREE,
                this.pieceLength + (i * 2));
            if ((i + 1) >= (this.gapSize / 2)) {
                ctx.lineWidth = 1;
            } else {
                ctx.lineWidth = 2;
            }
            alpha -= step;
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    }

    /**
     * Draw a visible cell that matches the cell value
     * @param ctx canvas
     * @param x x pixel position
     * @param y y pixel position
     * @param cellValue bomb state value
     * @param overrideColor color to use instead of default color
     */
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
            this.drawSquare(ctx, x, y, this.pieceLength / this.RECTANGLE_REDIS_DEGREE, this.pieceLength);
            ctx.lineWidth = this.lineWidth;
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
            const offset = (this.pieceLength / 2) + (this.lineWidth * 1.5);
            const ypos = y + (this.pieceLength / 2) + offset;// + this.pieceLength;
            const xpos = x + (this.pieceLength / 2);
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.arc(x + length / 2, y + length / 2, length / 2, 0, 2 * Math.PI);
            ctx.lineWidth = this.lineWidth;
            ctx.fillText(String(cellValue), xpos, ypos);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}