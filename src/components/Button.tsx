import React from 'react';
import "./Button.css"

interface Props {
    type: "button" | "submit";
    className?: string;
    text: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * Taken from:
 * https://codepen.io/finnhvman/pen/zpygBB
 */
const Button: React.FC<Props> = ({ type, className, text, onClick }) => {
    const classes = (className) ? `${className} button` : "button";
    if (onClick) {
        return <button className={classes} type={type} onClick={onClick}>
            {text}
        </button>
    }
    return <button className={classes} type={type}>{text}</button>
}

export default Button;