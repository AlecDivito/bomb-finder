import React, { Component } from "react";
import Preferences from "../models/Preferences";

interface Props {

}

interface State {
    preferences: Preferences;
}

export default class Settings extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            preferences: new Preferences()
        };
    }

    componentDidMount() {
        this.state.preferences.save();
    }

    public render() {
        return (
            <h1>Settings!!!</h1>
        );
    }
}
