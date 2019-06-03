import React from 'react';
import "./Button.css"

interface Props {
    type: "button" | "submit";
    text: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * Taken from:
 * https://codepen.io/finnhvman/pen/zpygBB
 */
const Button: React.FC<Props> = ({ type, text, onClick }) => {
    if (onClick) {
        return <button className="button" type={type} onClick={onClick}>
            {text}
        </button>
    }
    return <button className="button" type={type}>{text}</button>
}

export default Button;