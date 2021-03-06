import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import back from "../assets/arrow-left.svg";
import home from "../assets/home-f.svg";
import "./Header.css"

const Header: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
    if (props.location.pathname === "/") {
        return <div className="header--hidden">BombFinder</div>;
    }
    return (
        <header className="header">
            <div className="header__link"
                onClick={() => props.history.goBack()}>
                <img src={back} alt="Back" />
            </div>
            <h3>
                <Link to="/">BombFinder</Link>
            </h3>
            <Link to="/" className="header__link">
                <img src={home} alt="Home" />
            </Link>
        </header>
    );
}

export default withRouter(Header);