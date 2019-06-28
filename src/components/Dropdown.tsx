import React from 'react';
import "./Dropdown.css"

interface Props {
    items: string[];
    value: string;
    onChange: (event: React.FormEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<Props> = (props: Props) => {
    return <div className="select">
        <select className="select__input" onChange={props.onChange} >
            {props.items.map((item, i) =>
                <option key={i} value={item}>{item}</option>
            )})
        </select>
    </div>
}

export default Dropdown;