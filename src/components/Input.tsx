import React from 'react';
import "./Input.css"

interface State {
    focus: boolean;
}

interface Props {
    type: "text" | "number";
    name: string;
    text?: string;
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
        const { type, name, text, value, onChange } = this.props;
        const { focus } = this.state;
        const label = (text) ? text : name;
        const className = `form-input ${(focus) ? "focus" : ""}`;
        const validValue = (value) ? value : "";
        return <div className={className}>
            <label htmlFor={name}>{label}</label>
            <input type={type}
                id={name}
                name={name}
                value={validValue}
                onChange={onChange}
                onFocus={this.focus}
                onBlur={this.blur}
                required/>
        </div>
    }
}
