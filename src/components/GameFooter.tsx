import React from 'react';
import info from "../assets/info.svg";
import settings from "../assets/cog-f.svg";
import { Link } from 'react-router-dom';
import "./Footer.css"
import Switch from './Switch';

interface Props {
    flagToggle: (value: boolean) => void;
}

const GameFooter: React.FC<Props> = (props: Props) => {
    return (
        <footer className="footer footer--game">
            <Link to="/how-to-play">
                <img src={info} alt="Info" />
            </Link>
            <div className="footer__text">
                <span>Clear</span>
                <Switch onChange={(event: any) => props.flagToggle(event.target.checked) }/>
                <span>Flag</span>
            </div>
            <Link to="/settings">
                <img src={settings} alt="Settings" />
            </Link>
        </footer>
    );
}

export default GameFooter;