import React, { Component } from "react";

export default class HowToPlay extends Component {

    public render() {
        return (
            <React.Fragment>
                <h1>How to play</h1>
                <p>
                    An unrevealed tile might have a black hole behind it, it
                    might not. The idea is to clear all the tiles that don't
                    have black holes behind them.
                </p>
                <p>
                    But, the thing about a black hole – its main distinguishing
                    feature – is it's black. And the thing about space, the color
                    of space, your basic space color, is black. So how are you
                    supposed to avoid them? Here's how:
                </p>
                <br />
                <p>
                    If you avoid a black hole, the number tells you how many of
                    the 8 surrounding tiles are a black hole. If it's blank, none
                    of the surrounding tiles is a black hole.
                </p>
                <p>
                    If you think you know where a black hole is, flag it!
                </p>
                <br />
                <p>
                    Switch into flag mode, and tap the suspected tile. Once
                    you've flagged enough tiles around a clue, it'll become
                    active. Tap an active clue to clear all the non-flagged
                    tiles around it.
                </p>
                <h1>Controls</h1>
                <p>
                    Right click to toggle an invisible cell
                </p>
                <p>
                    Left click to flag aboutan invisible cell
                </p>
            </React.Fragment>
        );
    }
}

