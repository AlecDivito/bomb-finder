import React, { Component } from 'react';
import { GameDifficulty } from '../models/GameTypes';
import GameBoard from '../components/GameBoard';
import { RouteComponentProps } from 'react-router';
import uuid from '../util/uuid';

interface ParamProps {
    game: GameDifficulty;
}

type Props = RouteComponentProps<ParamProps>;

interface State {
    width: number;
    height: number;
    bombs: number;
    gameId: string;
}

export default class Game extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        switch (this.props.match.params.game) {
            case "easy":
                this.state = { width: 8, height: 8, bombs: 10, gameId: uuid() };
                break;
            case "medium":
                this.state = { width: 16, height: 16, bombs: 40, gameId: uuid() };
                break;
            case "hard":
                this.state = { width: 24, height: 24, bombs: 99, gameId: uuid() };
                break;
            case "custom": break;
            default: // ID
                break;
        }
    }

    public render() {
        console.log(this.state);
        return (
            <GameBoard
                id={this.state.gameId}
                difficulty={this.props.match.params.game}
                width={this.state.width}
                height={this.state.height}
                bombs={this.state.bombs} />
        );
    }
}
