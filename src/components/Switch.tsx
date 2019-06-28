import React from 'react';
import "./Switch.css";

interface Props {
    checked: boolean;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const Switch: React.FC<Props> = (props: Props) => {
    return <label className="switch">
        <input
            checked={props.checked}
            onChange={props.onChange}
            className="switch__input"
            type="checkbox" />
        <span className="switch__box">
            <span className="switch__marker" />
        </span>
    </label>
}

export default Switch;