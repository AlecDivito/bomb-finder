import React from 'react';
import "./Input.css"

interface State {
    focus: boolean;
}

interface Props {
    type: "text" | "number";
    name: string;
    value: string | number;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void
}

/**
 * Taken from:
 * https://codepen.io/rikschennink/pen/FHaLo
 */
export default class Input extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            focus: (props.value) ? true : false,
        }
    }

    focus = () => {
        this.setState({ focus: true });
    }

    blur = () => {
        if (!this.props.value) {
            this.setState({ focus: false });
        } 
    }

    render() {
        const { type, name, value, onChange } = this.props;
        const { focus } = this.state;
        const className = `form-input ${(focus) ? "focus" : ""}`
        return <div className={className}>
            <label htmlFor={name}>{name}</label>
            <input type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={this.focus}
                onBlur={this.blur}
                required/>
        </div>
    }
}
