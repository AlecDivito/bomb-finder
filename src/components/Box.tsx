import React from 'react';
import "./Box.css";

interface Props {
    onClick: () => void;
    className: string;
}

const Box: React.FC<Props> = ({onClick, className, children}) => {
    const classes = `box ${className}`;
    return <div onClick={onClick} className={classes}>{children}</div>
}

export default Box;