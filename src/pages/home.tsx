import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./home.css"

export default class Home extends Component {
    public render() {
        return (
            <div className="home">
                <div className="home__header">
                    <h1 className="home__header--center">Bomb Finder!</h1>
                </div>
                <ul className="home__list">
                    <li className="home__list__item"><Link to="/play">NEW GAME</Link></li>
                    <li className="home__list__item"><Link to="/stats">STATISTICS</Link></li>
                    <li className="home__list__item"><Link to="/about">ABOUT</Link></li>
                </ul>
            </div>
        );
    }
}
