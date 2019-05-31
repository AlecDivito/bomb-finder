import { Modal } from "./Modal";
import React from "react";

type Props = {
    show: boolean,
    close: () => void,
    submit: (state: State) => void,
}

type State = {
    width: number;
    height: number;
    bombs: number;
}

export default class CustomGameForm extends React.Component<Props, State> {

    state = {
        width: 8,
        height: 8,
        bombs: 10,
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
        this.props.submit(this.state);
    }

    render() {
        return (
            <Modal
                header="Custom Game Wizard Form"
                show={this.props.show}
                close={this.props.close}
                submit={this.handleSubmit}>
                <form>
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
                </form>
            </Modal>
        );
    }
}
