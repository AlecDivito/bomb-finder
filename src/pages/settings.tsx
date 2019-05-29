import React, { Component } from "react";
import Preferences from "../models/Preferences";

interface Props {

}

export default class Settings extends Component<Props, Preferences> {

    async componentDidMount() {
        const preferences = await Preferences.getPreferences();
        this.setState(preferences);
    }

    handleChange = (event: any) => {
        const target = event.target;
        let value;
        if (target.type === "checkbox") {
            value = target.checked;
        }
        else {
            value = parseInt(target.value, 10);
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
        Preferences.CreatePreferences(this.state).save();
    }

    public render() {
        if (!this.state) {
            return null;
        }
        return (
            <div>
                <h1>Settings!!!</h1>
                <form onSubmit={this.handleSubmit}>
                    <h3>User preferences</h3>
                    <p>
                    <label>
                        Allow Flags:
                        <input type="checkbox"
                            name="allowFlags"
                            checked={this.state.allowFlags}
                            onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Sound Volume:
                        <input type="range"
                            name="soundVolume"
                            value={this.state.soundVolume}
                            onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Music Volume:
                        <input type="range"
                            name="musicVolume"
                            value={this.state.musicVolume}
                            onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Show Milliseconds:
                        <input type="checkbox"
                            name="showMilliseconds"
                            checked={this.state.showMilliseconds}
                            onChange={this.handleChange} />
                    </label>
                    <br />
                    </p>
                    <p>
                        <input type="submit" value="Save Changes" onClick={this.handleSubmit} />
                    </p>
                </form>
                <small>
                    <strong>Last saved: </strong>
                    <time>{this.state.timestamp.toLocaleString()}</time>
                </small>
            </div>
        );
    }
}
