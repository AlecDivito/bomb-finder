import React from 'react';
import "./Box.css";

interface Props {
    onClick: () => void;
    className: string;
}

const Box: React.FC<Props> = (props) => {
    const classes = `box ${props.className}`;
    return <div className={classes}>{props.children}</div>
}

export default Box;