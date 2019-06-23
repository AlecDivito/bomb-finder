import React from 'react';
import "./Switch.css";

interface Props {
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const Switch: React.FC<Props> = (props: Props) => {
    return <label className="switch">
        <input onChange={props.onChange} className="switch__input" type="checkbox" />
        <span className="switch__box">
            <span className="switch__marker" />
        </span>
    </label>
}

export default Switch;