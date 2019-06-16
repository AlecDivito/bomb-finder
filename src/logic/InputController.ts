import { SimpleEventState } from "../models/EventTypes";
import { Point2d } from "../models/GameTypes";

interface Listener {
    element: HTMLElement;
    listeningTo: Array<keyof HTMLElementEventMap>;
}

// why not use
// https://reactjs.org/docs/events.html#pointer-events
export default class InputController {

    private listeners: { [key: number]: Listener } = {};
    private timer: number = 0;
    private touchTimer: number = 0;
    private touchThreshold: number = 300;
    private touchPoint?: Point2d;
    private idCounter: number = 0;

    private state?: SimpleEventState;

    /**
     * Place event listeners on a html element
     * 
     * @param {HTMLElement} element element events to be placed on
     * @param {String[]} events events to subscribe to
     * @returns {number} id that tracks your current input session
     */
    public start(element: HTMLElement, events: Array<keyof HTMLElementEventMap>): number {
        // add to listeners
        const id = this.uniqueId();
        this.listeners[id] = {
            element,
            listeningTo: []
        };

        events.forEach((event) => {
            const pointer = this.getFunctionPointer(event);
            this.listeners[id].element.addEventListener(event, pointer as any, {
                passive: event !== "contextmenu"
            });
            this.listeners[id].listeningTo.push(event);
        });

        return id;
    }

    /**
     * Get all event that happened
     * 
     * Remember to call flush() or else you will get old events that persisted
     * between frames
     * 
     * @param {number} id - The events binded to the element you want
     * @returns {Point2d | null} returns mouses new position or null if the 
     *      mouse hasn't moved since last checked
     */
    public pollEvents(id: number): SimpleEventState | undefined {
        if (this.state) {
            const rect = this.listeners[id].element.getBoundingClientRect();
            this.state.pos.x -= rect.left;
            this.state.pos.y -= rect.top;
        }
        return this.state;
    }

    /**
     * Remove all of the input state from the controller
     * @returns {void} 
     */
    public flush() {
        this.state = undefined;
    }

    public stop(id: number): boolean {
        if (this.listeners[id] === undefined) {
            return false;
        }

        this.listeners[id].listeningTo.forEach(event => {
            const pointer = this.getFunctionPointer(event);
            this.listeners[id].element.removeEventListener(event, pointer as any);
        });

        return true;
    }

    private getFunctionPointer(eventType: keyof HTMLElementEventMap) {
        switch (eventType) {
            case "mousemove": return this.mouseEvent;
            case "mousedown": return this.mouseEvent;
            case "mouseup": return this.mouseEvent;
            case "contextmenu": return this.stopContextMenu;
            case "touchstart": return this.touchEvent;
            case "touchmove": return this.touchEvent;
            case "touchend": return this.touchEvent;
        }
    }

    private mouseEvent = (event: MouseEvent) => {
        if (this.touchPoint) { // this means touch is active
            return;
        }
        if (this.state && this.state.events.includes("touch")) {
            return;
        }
        if (this.state) {
            this.state.events.push(event.type as any);
            return;
        }
        this.state = {
            leftClick: [1, 3, 5, 7].includes(event.buttons),
            middleClick: [4, 5, 6, 7].includes(event.buttons),
            rightClick: [2, 3, 6, 7].includes(event.buttons),
            pos: {
                x: event.pageX,
                y: event.pageY,
            },
            events: [event.type as any]
        };
    }

    private stopContextMenu = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    private touchEvent = (event: TouchEvent) => {
        if (event.type === "touchstart") {
            if (this.touchTimer === 0) {
                this.timer = Date.now();
            }
            this.touchPoint = {
                x: event.targetTouches[0].pageX,
                y: event.targetTouches[0].pageY,
            };
            return;
        }

        if (event.type === "touchmove") {
            this.touchPoint = undefined;
            return;
        }

        if (event.type === "touchend" && this.touchPoint) {
            const delta = Date.now() - this.timer;
            this.timer = Date.now();
            this.touchTimer += delta;
            this.state = {
                leftClick: this.touchTimer < this.touchThreshold,
                middleClick: false,
                rightClick: this.touchTimer > this.touchThreshold,
                pos: this.touchPoint!,
                events: ["touch"]
            }
            this.touchPoint = undefined;
            this.touchTimer = 0;
        }
    }

    private uniqueId() {
        return this.idCounter++;
    }
}
