
type AnimationCallback = (delta: number) => number;
type AnimationComplete = (timer: number, target: number) => boolean;

export default class AnimationTimer {

    private timer = 0;
    private target: number;
    private step: number;
    private loop: boolean;

    constructor(target: number, step: number, loop: boolean = false) {
        this.timer = 0;
        this.target = target;
        this.step = step;
        this.loop = loop;
    }

    update(delta: number) {
        if (!this.isComplete()) {
            this.timer += this.step;
        } else {
            if (this.loop) {
                this.timer = this.timer % this.target;
            } else {
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
        return this.timer >= this.target;
    }
}