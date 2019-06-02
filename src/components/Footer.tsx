import React from 'react';
import { Link } from 'react-router-dom';
import "./Footer.css"
import info from "../assets/info.svg";
import settings from "../assets/cog-f.svg";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <Link to="/how-to-play">
                <img src={info} alt="Info" />
            </Link>
            <Link to="/settings">
                <img src={settings} alt="Settings" />
            </Link>
        </footer>
    );
}

export default Footer