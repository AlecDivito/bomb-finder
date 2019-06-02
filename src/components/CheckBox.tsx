import React from 'react';
import "./CheckBox.css"

interface Props {
    text: string;
    name: string;
    checked: boolean;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void
}

/**
 * Taken from:
 * https://codepen.io/finnhvman/pen/zpygBB
 */
const CheckBox: React.FC<Props> = ({text, name, checked, onChange}) => {
    return  <label className="checkbox">
        <input type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}  />
            <span>{text}</span>
    </label>
}

export default CheckBox;