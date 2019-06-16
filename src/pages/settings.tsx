import React, { Component } from "react";
import Preferences from "../models/Preferences";
import CheckBox from "../components/CheckBox";
import Slider from "../components/Slider";
import Loading from "../components/Loading";
import Button from "../components/Button";

interface Props {

}

export default class Settings extends Component<Props, Preferences> {

    async componentDidMount() {
        const preferences = await Preferences.GetPreferences();
        this.setState(preferences);
        console.log(this.state);
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

        console.log({[name]:value});

        this.setState({
            [name]: value
        } as Pick<Preferences, keyof Preferences>);
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        this.setState({
            timestamp: new Date()
        });
        console.log(this.state);
        Preferences.CreatePreferences(this.state).save();
    }

    public render() {
        if (!this.state) {
            return <Loading />;
        }
        return (
            <div>
                <h1>Settings!!!</h1>
                <form onSubmit={this.handleSubmit}>
                    <h3>User preferences</h3>
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
