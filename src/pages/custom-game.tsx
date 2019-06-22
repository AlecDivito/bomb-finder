import React from "react";
import Input from "../components/Input";
import "./custom-game.css";
import CheckBox from "../components/CheckBox";
import Button from "../components/Button";
import { Redirect } from "react-router";
import Games from "../models/Games";
import uuid from "../util/uuid";
import CustomGameConfig, { ICustomGameConfig } from "../models/CustomGameConfig";
import Loading from "../components/Loading";
import { FormError } from "../models/Types";
import { isObjectEmpty } from "../util/isObjectEmpty";

interface State extends ICustomGameConfig {
    save: boolean;
    gameId?: string;
    errors: FormError<ICustomGameConfig>;
}

export default class CustomGameForm extends React.Component<{}, State> {

    componentDidMount() {
        const c = Object.assign({},
            new CustomGameConfig(),
            {gameId: undefined, errors: {}}
        );
        this.setState({...c});
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
            [name]: value,
        } as Pick<State, keyof State>, this.validate);
    }

    validate = () => {
        const errors = CustomGameConfig.validate(this.state);
        this.setState({errors});
    }

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const errors = CustomGameConfig.validate(this.state);
        if (!isObjectEmpty(errors)) {
            this.setState({errors});
            return;
        }
        if (this.state.save) {
            await CustomGameConfig.save(this.state);
        }
        let { width, height, bombs, name } = this.state;
        if (!name) {
            name = "custom";
        }
        const game = Games.Create(uuid(), name, width, height, bombs);
        const result = await Games.save(game);
        if (result) {
            this.setState({ gameId: game.id });
        } else {
            // TODO: Add error handling
        }
    }

    render() {
        if (!this.state) {
            return <Loading />;
        }
        if (this.state.gameId) {
            return <Redirect to={`/game/${this.state.gameId}`} />
        }
        return (
            <div style={{ margin: '0px 16px' }}>
                <h3>Create New Game</h3>
                <form className="custom" onSubmit={this.handleSubmit}>
                    <div className="custom-inline">
                        <Input type="number"
                            name="width"
                            error={this.state.errors.width}
                            value={this.state.width}
                            onBlur={this.validate}
                            onChange={this.handleChange} />
                        <Input type="number"
                            name="height"
                            error={this.state.errors.height}
                            value={this.state.height}
                            onBlur={this.validate}
                            onChange={this.handleChange} />
                    </div>
                    <Input type="number"
                        name="bombs"
                        error={this.state.errors.bombs}
                        value={this.state.bombs}
                        onBlur={this.validate}
                        onChange={this.handleChange} />
                    <CheckBox text="Save Game Configuration"
                        name="save"
                        checked={this.state.save}
                        onChange={this.handleChange} />
                    {(!this.state.save)
                        ? null
                        : <Input type="text"
                            name="name"
                            error={this.state.errors.name}
                            value={this.state.name}
                            onBlur={this.validate}
                            onChange={this.handleChange} />
                    }
                    <Button type="submit"
                        disabled={!isObjectEmpty(this.state.errors)}
                        text="Start Game" />
                </form>
            </div>
        );
    }
}
