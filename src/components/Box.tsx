import React from 'react';
import "./Box.css";

interface Props {
    onClick: () => void;
    className: string;
    degree: number;
}

const Box: React.FC<Props> = ({onClick, degree, className, children}) => {
    const classes = `box ${className}`;
    const clampedDegree = degree % 360;
    const clampedMax = (degree + 75) % 360; 
    const style = {
        background: `
            linear-gradient(135deg,
            hsl(${clampedDegree}, 51.3%, 46.7%) 0%,
            hsl(${clampedMax}, 96%, 62.9%) 100%)`
    };
    return <div onClick={onClick}
        style={style}
        className={classes}>
        {children}
    </div>
}

export default Box;