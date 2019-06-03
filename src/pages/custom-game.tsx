import React from "react";
import Input from "../components/Input";
import "./custom-game.css";
import CheckBox from "../components/CheckBox";
import Button from "../components/Button";
import { Redirect } from "react-router";
import Games from "../models/Games";
import uuid from "../util/uuid";

type State = {
    width: number;
    height: number;
    bombs: number;
    save: boolean;
    name: string;
    gameId?: string;
}

export default class CustomGameForm extends React.Component<{}, State> {

    state = {
        width: 8,
        height: 8,
        bombs: 10,
        save: false,
        name: "",
        gameId: undefined,
    }

    handleChange = (event: any) => {
        const target = event.target;
        let value;
        if (target.type === "checkbox") {
            value = target.checked;
        }
        else if (target.type === "text") {
            value = target.value;
        }
        else {
            value = parseInt(target.value, 10);
        }
        const name = target.name;

        this.setState({
            [name]: value
        } as Pick<State, keyof State>);
    }

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO: Save Game Template
        const { width, height, bombs } = this.state;
        const game = new Games(uuid(), "custom", width, height, bombs);
        await game.save();
        this.setState({ gameId: game.id });
    }

    render() {
        if (this.state.gameId) {
            return <Redirect to={`/game/${this.state.gameId}`} />
        }
        return (
            <React.Fragment>
                <h3>Create New Game</h3>
                <form className="custom" onSubmit={this.handleSubmit}>
                    <div className="custom-inline">
                        <Input type="number"
                            name="width"
                            value={this.state.width}
                            onChange={this.handleChange} />
                        <Input type="number"
                            name="height"
                            value={this.state.height}
                            onChange={this.handleChange} />
                    </div>
                    <Input type="number"
                        name="bombs"
                        value={this.state.bombs}
                        onChange={this.handleChange} />
                    <CheckBox text="Save Game Configuration"
                        name="save"
                        checked={this.state.save}
                        onChange={this.handleChange} />
                    {(!this.state.save)
                        ? null
                        : <Input type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange} />
                    }
                    <Button type="submit"
                        text="Start Game" />
                </form>
            </React.Fragment>
        );
    }
}
