import { EventState } from "../models/EventTypes";

interface Listener {
    element: HTMLElement;
    listeningTo: Array<keyof HTMLElementEventMap>;
}

export default class InputController {

    private listeners: { [key: number]: Listener } = {};
    private idCounter: number = 0;

    private state: EventState = {
        mouse: undefined,
        mouseButton: undefined,
    };

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
            this.listeners[id].element.addEventListener(event, pointer as any);
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
    public pollEvents(id: number): EventState | null {
        if (this.state.mouse !== undefined) {
            this.state.mouse.localX = (this.state.mouse.pageX -
                this.listeners[id].element.offsetLeft) + window.scrollX;
            this.state.mouse.localY = (this.state.mouse.pageY -
                this.listeners[id].element.offsetTop) + window.scrollY;
        }
        if (this.state.mouseButton !== undefined) {
            this.state.mouseButton.localX = (this.state.mouseButton.localX -
                this.listeners[id].element.offsetLeft) + window.scrollX;
            this.state.mouseButton.localY = (this.state.mouseButton.localY -
                this.listeners[id].element.offsetTop) + window.scrollY;
        }
        return this.state;
    }

    /**
     * Remove all of the input state from the controller
     * @returns {void} 
     */
    public flush() {
        this.state.mouse = undefined;
        this.state.mouseButton = undefined;
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
            case "mousemove": return this.mouseMoveEvent;
            case "mousedown": return this.mouseDownEvent;
            case "mouseup": return this.mouseUpEvent;
            case "contextmenu": return this.stopContextMenu;
        }
    }

    private mouseMoveEvent = (event: MouseEvent) => {
        this.state.mouse = {
            pageX: event.pageX,
            pageY: event.pageY,
            localX: 0,
            localY: 0,
        };
    }

    private mouseDownEvent = (event: MouseEvent) => {
        event.preventDefault();
        this.state.mouseButton = {
            left: false,
            middle: false,
            right: false,
            localX: event.pageX,
            localY: event.pageY,
        };
        switch (event.buttons) {
            case 0: this.state.mouseButton = undefined; break;
            case 1: this.state.mouseButton.left = true; break;
            case 2: this.state.mouseButton.right = true; break;
            case 3:
                this.state.mouseButton.left = true;
                this.state.mouseButton.right = true;
                break;
            case 4: this.state.mouseButton.middle = true; break;
            case 5:
                this.state.mouseButton.middle = true;
                this.state.mouseButton.left = true;
                break;
            case 6:
                this.state.mouseButton.middle = true;
                this.state.mouseButton.right = true;
                break;
            case 7:
                this.state.mouseButton.middle = true;
                this.state.mouseButton.right = true;
                this.state.mouseButton.left = true;
                break;
        }
    }

    private mouseUpEvent = (event: MouseEvent) => {
        event.preventDefault();
    }

    private stopContextMenu = (event: any) => {
        event.preventDefault();
        return false;
    }

    private uniqueId() {
        return this.idCounter++;
    }
}
