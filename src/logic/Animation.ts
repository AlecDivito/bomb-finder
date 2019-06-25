
export enum LoopOptions {
    REPEAT,
    ALTERNATE,
    STOP
}

export default class AnimationTimer {

    private playing: boolean;
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
        this.playing = true;
    }

    update(delta: number) {
        if (!this.isComplete() && this.playing) {
            this.timer += this.step;
        } else {
            if (this.loop === LoopOptions.REPEAT) {
                this.timer = this.timer % this.target;
            } else if (this.loop === LoopOptions.ALTERNATE) {
                this.setStep(this.step * -1);
                if (!this.alternated) {
                    this.timer = 0;
                } else {
                    this.timer = this.target;
                }
            } else if (this.loop === LoopOptions.STOP) {
                this.timer = this.target;
                this.stop();
            }
        }
    }

    public stop() {
        this.playing = false;
    }

    public play() {
        this.playing = true;
    }

    public getValue() {
        return this.timer;
    }

    public setTarget(target: number) {
        this.target = target;
    }

    public setStep(step: number) {
        if (step < 0) {
            this.alternated = true;
        } else {
            this.alternated = false;
        }
        this.step = step;
    }

    public isComplete() {
        return (this.alternated)
            ? this.timer <= 0
            : this.timer >= this.target;
    }
}