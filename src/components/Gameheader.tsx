import React from 'react';
import toHHMMSS from '../util/toHHMMSS';
import piece from "../assets/piece.svg";
import hourglass from "../assets/hourglass.svg";
import "./Header.css"

interface Props {
    time: number;
    left: number;
    pieces: number;
}

const GameHeader: React.FC<Props> = (props: Props) => {
    return <header className="header">
        <div className="header__detail" >
            <img src={piece} alt="Home" />
            <span>{props.left}/{props.pieces}</span>
        </div>
        <h3>
            BombFinder
        </h3>
        <div className="header__detail">
            <span>{toHHMMSS(props.time)}</span>
            <img src={hourglass} alt="Home" />
        </div>
    </header>
}

export default GameHeader;