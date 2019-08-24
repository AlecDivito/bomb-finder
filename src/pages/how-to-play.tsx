import React, { Component } from "react";
import pieceValueZero from "../assets/images/piece_value_0.png";
import pieceInvisible from "../assets/images/piece_invisible.png";
import pieceMarkedInvisible from "../assets/images/piece_marked_invisible.png";
import pieceBomb from "../assets/images/piece_bomb.png";
import pieceVisible from "../assets/images/piece_visible.png";
import pieceVisibleSatisfied from "../assets/images/piece_visible_satisfied.png";
import gameHeader from "../assets/images/game_header.png";
import "./how-to-play.css"
import { Link } from "react-router-dom";

export default class HowToPlay extends Component {

    public render() {
        return (
            <div className="how-to-play">
                <h1>How to play</h1>
                <div className="htp--center">
                    <span className="htp__image">
                        <img className="htp__image--img" src={pieceInvisible} alt="Piece that is invisible" />
                        <span className="htp--text">Unrevealed</span>
                    </span>
                    <span className="htp__image">
                        <img className="htp__image--img" src={pieceBomb} alt="Piece that is a bomb and is visible" />
                        <span className="htp--text">Bomb</span>
                    </span>
                </div>
                <p>
                    The goal of the game is to clear the entire board of squares
                    without clicking on a bomb. The board contains a set amount
                    of bombs and if you click on one, you lose. If you manage to
                    clear the board without clicking on any of the bombs, you 
                    win the game!
                </p>
                <div className="htp--center">
                    <span className="htp__image">
                        <img className="htp__image--img" src={pieceValueZero} alt="Piece that has the value 0" />
                        <span className="htp--text">Clear</span>
                    </span>
                    <span className="htp__image">
                        <img className="htp__image--img" src={pieceVisible} alt="Piece that is visible" />
                        <span className="htp--text">Clue</span>
                    </span>
                </div>
                <p>
                    When clicking a square that does not contain a bomb, you
                    maybe presented with a number. That number indicates how
                    many bombs are adjacent (or neighbors) to that piece. You
                    can use this information to guess where a bomb maybe is. At
                    times some pieces will have 0 neighbors and those with 0
                    neighbors will automatically be cleared. If you think a
                    unrevealed piece is a bomb, flag it!
                </p>
                <div className="htp--center">
                    <span className="htp__image">
                        <img className="htp__image--img" src={pieceMarkedInvisible} alt="Piece that is invisible and flagged" />
                        <span className="htp--text">Flagged</span>
                    </span>
                    <span className="htp__image">
                        <img className="htp__image--img" src={pieceVisibleSatisfied} alt="Piece that is visiblely satisfied" />
                        <span className="htp--text">Satisfied</span>
                    </span>
                </div>
                <p>
                    By flagging a piece, you get a helpful feature where the
                    piece's that are satisfied will shine blue. A piece that
                    shine blue means that the neighbors you marked of this piece
                    are satisfied
                </p>
                <p>
                    Don't worry about putting a marker on all the bombs though
                    as that is not a requirement to win. All you need to do is
                    clear all the squares that aren't bombs. Marking the bombs
                    only help you visually.
                </p>
                <h3>Status Information</h3>
                <div className="htp--center">
                    <img className="htp--image--header"
                        src={gameHeader}
                        alt="Game header information example"
                        width="200" height="60"/>
                </div>
                <p>
                    The top left hand corner of the play field has the remaining
                    pieces that need to be uncovered. This number will not change
                    when a piece is marked, only flipped.
                </p>
                <p>
                    The top right hand corner contains your "score" or how much
                    time you have spent playing the game. Try and get the lowest
                    time possible on all your games!
                </p>
                <h3>Controls</h3>
                <p>
                    To open a square, you must left click on it with your mouse
                    (on mobile you can tap the square). To mark a square as a 
                    bomb you can flag it by right clicking with your mouse (on
                    mobile you can hold down the piece for 1 second and that
                    will mark it). 
                </p>
                <p>
                    You can also switch into and out of "flag mode" by clicking
                    "f" on a keyboard. While in flag mode, any left click or 
                    mobile touch will result in the piece getting flagged instead
                    of revealed. 
                </p>
                <h3>Options and Enhancements</h3>
                <p>
                    You are able to change your game board a little bit in the
                    settings page. Here you can decide how large you want the
                    pieces and how fancy you want them to look.
                </p>
                <Link className="htp--link" to="/settings">Why not take a look.</Link>
                <h3>Privacy Policy</h3>
                <p>
                    We use Google analytics to track basic visit data. All other
                    information like high score, statistics, games played and
                    game templates are all stored locally. No other data is sent
                    to a server.
                </p>
                <h3>Insperation</h3>
                <p>
                    This game was inspired by the game <a rel="nofollow" target="_black" className="htp--link" href="https://proxx.app">proxx</a>,
                    a mine sweeper clone that Google Chrome Labs created that
                    targeted all devices that are capable of using a web browser.
                </p>
            </div>
        );
    }
}

