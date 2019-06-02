import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import "./Header.css"
import back from "../assets/arrow-left.svg";

const Header: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
    // TODO: Check style if we need to render a hidden element or just null
    if (props.location.pathname === "/") {
        return <div className="header--hidden">BombFinder</div>;
    }
    return (
        <header className="header">
            <Link to="/">
                <img src={back} alt="Go To Main Menu" />
            </Link>
            <h3>
                <Link to="/">
                    BombFinder
                </Link>
            </h3>
            <Link to="/">
                <img src={back} alt="delete me" />
            </Link>
        </header>
    );
}

export default withRouter(Header);