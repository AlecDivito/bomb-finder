
export enum LoopOptions {
    REPEAT,
    ALTERNATE,
    STOP
}

export default class AnimationTimer {

    private timer = 0;
    private target: number;
    private step: number;
    private loop: LoopOptions;
    private alternated: boolean;

    constructor(target: number, step: number, loop: LoopOptions = LoopOptions.STOP) {
        this.timer = 0;
        this.target = target;
        this.step = step;
        this.loop = loop;
        this.alternated = false;
    }

    update(delta: number) {
        if (!this.isComplete()) {
            this.timer += this.step;
        } else {
            if (this.loop === LoopOptions.REPEAT) {
                this.timer = this.timer % this.target;
            } else if (this.loop === LoopOptions.ALTERNATE) {
                this.step = this.step * -1;
                if (this.alternated) {
                    this.timer = 0;
                } else {
                    this.timer = this.target;
                }
                this.alternated = true;
            } else if (this.loop === LoopOptions.STOP) {
                this.timer = this.target;
            }
        }
    }

    public getValue() {
        return this.timer;
    }

    public setTarget(target: number) {
        this.target = target;
    }

    public setStep(step: number) {
        this.step = step;
    }

    public isComplete() {
        if (this.loop !== LoopOptions.ALTERNATE) {
            return this.timer >= this.target;
        }
        return (this.alternated)
            ? this.timer <= 0
            : this.timer >= this.target;
    }
}