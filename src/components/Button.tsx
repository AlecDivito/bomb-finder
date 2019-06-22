import React from 'react';
import "./Button.css"

interface Props {
    type: "button" | "submit";
    className?: string;
    disabled?: boolean;
    text: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * Taken from:
 * https://codepen.io/finnhvman/pen/zpygBB
 */
const Button: React.FC<Props> = ({ type, disabled, className, text, onClick }) => {
    const disabledClass = (disabled) ? "button disabled" : "button";
    const classes = (className) ? `${className} ${disabledClass}` : disabledClass;
    if (onClick) {
        return <button className={classes}
            disabled={disabled}
            type={type}
            onClick={onClick}>
            {text}
        </button>
    }
    return <button className={classes} disabled={disabled} type={type}>{text}</button>
}

export default Button;