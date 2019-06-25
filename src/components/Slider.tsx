import React from 'react';
import "./Slider.css"
import "./Input.css"

interface Props {
    text: string;
    name: string;
    value: number;
    max?: number;
    min?: number;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<Props> = ({text, name, value, max, min, onChange}) => {
    let maximum = (max) ? max : 100;
    let minimum = (min) ? min : 0;
    return <div className="form-input slider">
        <label htmlFor={name}>{text} ({value})</label>
        <input type="range"
            id={name}
            name={name}
            value={value}
            max={maximum}
            min={minimum}
            onChange={onChange} />
    </div>
}

export default Slider;