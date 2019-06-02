import BombFinder from "./BombFinder";
import { Visibility } from "../models/GameBoardTypes";
import { EventState } from "../models/EventTypes";


export default class BombFinderRenderer {

    private readonly state: BombFinder;

    // keeping coloring background code for later maybe
    private counter = 0;
    private timer = 0;

    constructor(state: BombFinder) {
        this.state = state;
    }

    public get gameBoardWidth() {
        return (this.state.getWidth * this.state.getSize) +
            ((this.state.getWidth + 1) * this.state.getGaps)
    }

    public get gameBoardHeight() {
        return (this.state.getHeight * this.state.getSize) +
            ((this.state.getHeight + 1) * this.state.getGaps)
    }

    public update(mousePos: EventState) {
        console.log(mousePos)
    }

    public draw(ctx: CanvasRenderingContext2D, delta: number) {
        // this.timer += delta;
        // if (this.timer > 5000) {
        //     this.counter++;
        //     this.timer = 0;
        //     if (this.counter > 360) {
        //         this.counter = 0;
        //     }
        // }
        this.drawBackground(ctx);
        this.drawBoard(ctx)
    }

    private drawBackground(ctx: CanvasRenderingContext2D) {
        ctx.save();
        // keeping coloring background code for later maybe
        // ctx.fillStyle = `hsl(${this.counter}, 100%, 50%)`;
        ctx.fillStyle = "#333333";
        ctx.fillRect(0, 0, this.gameBoardWidth, this.gameBoardHeight);
        ctx.restore();
    }

    private drawBoard(ctx: CanvasRenderingContext2D) {
        ctx.save();
        this.state.getGrid.forEach((cell, index) => {
            const row = Math.floor(index / this.state.getWidth);
            const col = index % this.state.getWidth;

            const x = (this.state.getGaps * (col + 1)) + (this.state.getSize * col);
            const y = (this.state.getGaps * (row + 1)) + (this.state.getSize * row);

            switch (cell.visibility) {
                case Visibility.INVISIBLE:
                    ctx.fillStyle = (cell.hover) ? "#0000FF" : "#FFFFFF";
                    break;
                case Visibility.MARKED:
                    ctx.fillStyle = "#FF0000";
                    break;
                case Visibility.VISIBLE:
                    ctx.fillStyle = "#CCCCCC";
                    break;
                default:
                    break;
            }
            ctx.fillRect(x, y, this.state.getSize, this.state.getSize);
            if (cell.visibility === Visibility.VISIBLE) {
                ctx.fillStyle = "#000000";
                ctx.font = "48px serif";
                const offset = + (this.state.getSize / 2);
                ctx.fillText(String(cell.value), x + offset - 15, y + offset + 15);
            }
        });
        ctx.restore();
    }
}


