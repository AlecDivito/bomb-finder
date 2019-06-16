import React from 'react';
import "./Slider.css"
import "./Input.css"

interface Props {
    text: string;
    name: string;
    value: number;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<Props> = ({text, name, value, onChange}) => {
    return <div className="form-input slider">
        <label htmlFor={name}>{text}</label>
        <input type="range"
            id={name}
            name={name}
            value={value}
            onChange={onChange} />
    </div>
}

export default Slider;