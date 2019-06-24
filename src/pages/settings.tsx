import React, { Component } from "react";
import Preferences, { IPreferences } from "../models/Preferences";
import CheckBox from "../components/CheckBox";
import Slider from "../components/Slider";
import Loading from "../components/Loading";
import Button from "../components/Button";
import Input from "../components/Input";

interface Props {

}

export default class Settings extends Component<Props, IPreferences> {

    private canvas?: HTMLCanvasElement;
    private ctx?: CanvasRenderingContext2D;

    async componentDidMount() {
        const preferences = await Preferences.GetPreferences();
        this.setState(preferences);
        this.canvas = document.getElementById('preview') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        requestAnimationFrame(this.draw);
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

    draw = () => {
        let size: number, gap: number;
        if (this.state.defaultCellSize && this.state.defaultCellSize < 8) {
            size = 8;
        } else {
            size = this.state.defaultCellSize;
        }
        if (this.state.gridGapSize && this.state.gridGapSize < 1) {
            gap = 1;
        } else {
            gap = this.state.gridGapSize;
        }
        this.ctx!.save();
        [0, 0, 1, 1].forEach((c, i) => {
            const index = (i % 2);
            const x = (index * size) + (gap * index);
            const y = (c * size) + (gap * c);
            this.ctx!.fillRect(x, y, size, size);
            this.ctx!.fillStyle = "#FFFFFF";
        });
        this.ctx!.restore();
    }

    public render() {
        if (!this.state) {
            return <Loading />;
        }
        const dimensions = (this.state.defaultCellSize + this.state.gridGapSize) * 2;
        requestAnimationFrame(this.draw);
        return (
            <div style={{ margin: '0px 16px' }}>
                <h1>Settings</h1>
                <form onSubmit={this.handleSubmit}>
                    <h3>User preferences</h3>
                    <Input type="number"
                        text="Default Grid Cell Size"
                        name="defaultCellSize"
                        value={this.state.defaultCellSize}
                        onChange={this.handleChange}/>
                    <Input type="number"
                        text="Default Grid Gap Size"
                        name="gridGapSize"
                        value={this.state.gridGapSize}
                        onChange={this.handleChange} />
                    <h3>Grid Preview</h3>
                    <div className="form-input center overflow-x">
                        <canvas id="preview" width={dimensions} height={dimensions}/>
                    </div>
                    <Slider text="Sound Volume"
                        name="soundVolume"
                        value={this.state.soundVolume}
                        onChange={this.handleChange} />
                    <Slider text="Music Volume"
                        name="musicVolume"
                        value={this.state.musicVolume}
                        onChange={this.handleChange} />
                    <CheckBox text="Allow Flags"
                        name="allowFlags"
                        checked={this.state.allowFlags}
                        onChange={this.handleChange} />
                    <CheckBox text="Show Milliseconds"
                        name="showMilliseconds"
                        checked={this.state.showMilliseconds}
                        onChange={this.handleChange}/>
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
