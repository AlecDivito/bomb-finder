
type AnimationCallback = (delta: number) => number;
type AnimationComplete = (timer: number, target: number) => boolean;

export default class AnimationTimer {

    private isPaused: boolean = false;
    private timer = 0;
    private target: number;
    private callback: AnimationCallback;
    private isComplete: AnimationComplete;

    constructor(target: number, callback: AnimationCallback, isComplete: AnimationComplete) {
        this.target = target;
        this.callback = callback;
        this.isComplete = isComplete;
        this.timer = 0;
    }

    update(delta: number) {
        if (!this.isComplete(this.timer, this.target)) {
            this.timer += this.callback(delta);
        } else {
            this.timer = this.target;
        }
    }

    public setTarget(target: number) {
        this.target = target;
    }

    public setIsComplete(isComplete: AnimationComplete) {
        this.isComplete = isComplete;
    }

    public setCallback(callback: AnimationCallback) {
        this.callback = callback;
    }

    public getValue() {
        return this.timer;
    }

    public getTarget() {
        return this.target;
    }
}