import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import "./Header.css"
import back from "../assets/arrow-left.svg";

const Header: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
    console.log(props);
    if (props.location.pathname === "/") {
        return null;
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