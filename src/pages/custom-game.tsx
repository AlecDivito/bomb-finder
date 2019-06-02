import React from "react";

type State = {
    width: number;
    height: number;
    bombs: number;
    save: boolean;
    name: string;
}

export default class CustomGameForm extends React.Component<{}, State> {

    state = {
        width: 8,
        height: 8,
        bombs: 10,
        save: false,
        name: "",
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
        } as Pick<State, keyof State>);
    }

    handleSubmit = () => {
        console.log(this.state)
    }

    render() {
        return (
            <React.Fragment>
                <h3>Create New Game</h3>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Width
                        <input type="number"
                            name="width"
                            value={this.state.width}
                            onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Height
                        <input type="number"
                            name="height"
                            value={this.state.height}
                            onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Bombs
                        <input type="number"
                            name="bombs"
                            value={this.state.bombs}
                            onChange={this.handleChange} />
                    </label>
                    <label>
                        Save Custom Game
                        <input type="checkbox"
                            name="save"
                            checked={this.state.save}
                            onChange={this.handleChange} />
                    </label>
                    {
                        (!this.state.save)
                        ? null
                        : <label>
                            Custom GameMode Name:
                            <input name="name"
                                value={this.state.name}
                                onChange={this.handleChange} />
                        </label>
                    }
                </form>
            </React.Fragment>
        );
    }
}
