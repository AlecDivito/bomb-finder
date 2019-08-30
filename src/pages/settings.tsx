import React, { Component } from "react";
import Preferences, { IPreferences } from "../models/Preferences";
import CheckBox from "../components/CheckBox";
import Slider from "../components/Slider";
import Loading from "../components/Loading";
import Button from "../components/Button";
import BombFinderPieceRenderer from "../logic/BombFinderPieceRenderer";
import "./settings.css";

export default class Settings extends Component<{}, IPreferences> {

    private keepUpdating: boolean = true;
    private lastFrame: number = 0; 
    private rafId: number = 0;
    private canvas?: HTMLCanvasElement;
    private ctx?: CanvasRenderingContext2D;
    private pieceRenderer?: BombFinderPieceRenderer;

    async componentDidMount() {
        const preferences = await Preferences.GetPreferences();
        this.setState(preferences);
        this.canvas = document.getElementById('preview') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.pieceRenderer = new BombFinderPieceRenderer(preferences);
        requestAnimationFrame(this.draw);
    }

    componentWillUnmount() {
        this.keepUpdating = false;
        cancelAnimationFrame(this.rafId);
    }

    handleChange = (event: any) => {
        const target = event.target;
        let value;
        if (target.type === "checkbox") {
            value = target.checked;
        }
        else {
            value = parseInt(target.value, 10);
            if (isNaN(value)) {
                value = 0;
            }
        }
        const name = target.name;

        switch(name) {
            case "defaultCellSize": this.pieceRenderer!.setCellSize(value); break;
            case "gridGapSize":     this.pieceRenderer!.setGapSize(value); break;
            case "spinningCubes":   this.pieceRenderer!.setSpinningCubes(value); break;
            case "simpleRender":    this.pieceRenderer!.setSimpleRender(value); break;
        }

        this.setState({
            [name]: value
        } as Pick<Preferences, keyof Preferences>);
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        this.setState({
            timestamp: new Date()
        });
        Preferences.Save(this.state);
    }

    draw = (delta: number) => {
        const elapsedTime = delta - this.lastFrame!;
        // clear board
        const size = (this.state.defaultCellSize * 2) + this.state.gridGapSize;
        this.ctx!.fillStyle = "#333";
        this.ctx!.fillRect(0, 0, size, size);
        // update and draw place holders
        this.pieceRenderer!.update(elapsedTime);
        [0, 0, 1, 1].forEach((c, i) => {
            const index = (i % 2);
            const x = 3 + (index * this.state.defaultCellSize) + (this.state.gridGapSize * index);
            const y = 3 + (c * this.state.defaultCellSize) + (this.state.gridGapSize * c);
            this.pieceRenderer!.drawPlaceHolder(this.ctx!, x, y, i);
        });
        if (this.keepUpdating) {
            this.rafId = requestAnimationFrame(this.draw);
            this.lastFrame = delta;
        }
    }

    public render() {
        if (!this.state) {
            return <Loading />;
        }
        const dimensions = (this.state.defaultCellSize * 2) + this.state.gridGapSize * 2;
        return (
            <div className="settings">
                <h1>Settings</h1>
                <form onSubmit={this.handleSubmit}>
                    {/* <h3>User preferences</h3> */}

                    <Slider text="Piece Length"
                        name="defaultCellSize"
                        max={125}
                        min={25}
                        value={this.state.defaultCellSize}
                        onChange={this.handleChange} />

                    <Slider text="Piece Gap"
                        name="gridGapSize"
                        max={50}
                        min={0}
                        value={this.state.gridGapSize}
                        onChange={this.handleChange} />

                    <Slider text="Spinning Cubes"
                        name="spinningCubes"
                        max={10}
                        min={0}
                        value={this.state.spinningCubes}
                        onChange={this.handleChange} />

                    <CheckBox text="Simple Render"
                        name="simpleRender"
                        checked={this.state.simpleRender}
                        onChange={this.handleChange} />

                    <h3>Grid Preview</h3>
                    <div className="form-input center">
                        <canvas id="preview" width={dimensions} height={dimensions}/>
                    </div>

                    <CheckBox text="Can't lose on first move"
                        name="firstMoveHandicap"
                        checked={this.state.firstMoveHandicap}
                        onChange={this.handleChange} />

                    <CheckBox text="Viberations"
                        name="vibration"
                        checked={this.state.vibration}
                        onChange={this.handleChange} />
                    
                    <Button type="submit" text="Save Changes"/>
                </form>
                <p>
                    <small>
                        <strong>Last saved: </strong>
                        <time>{this.state.timestamp.toLocaleString()}</time>
                    </small>
                </p>
            </div>
        );
    }
}
