import React, { Component } from 'react';
import { GameProgress } from '../models/GameTypes';
import GameBoard from '../components/GameBoard';
import { RouteComponentProps, Redirect } from 'react-router';
import Games from '../models/Games';

interface ParamProps {
    id: string;
}

type Props = RouteComponentProps<ParamProps>;

interface State {
    // for when the game is done
    to404Page: boolean;
    toWonPage: boolean;
    ready: boolean;
}

export default class Game extends Component<Props, State> {

    state: Readonly<State> = {
        to404Page: false,
        toWonPage: false,
        ready: false,
    }

    async componentDidMount() {
        const exists = await Games.DoesGameExists(this.props.match.params.id);
        if (exists) {
            this.setState({ to404Page: false, ready: true });
        }
        else {
            this.setState({ to404Page: true, ready: true });
        }
    }

    gameFinished = (result: GameProgress) => {
        this.setState({ toWonPage: result === "won" });
    }

    public render() {
        if (this.state.toWonPage) {
            return <Redirect to={`/game/${this.props.match.params.id}/game-won`} />
        }
        else if (this.state.to404Page) {
            console.warn("Please implement me (404 page)");
            return null;
        }
        else if (this.state.ready) {
            return <GameBoard
                id={this.props.match.params.id}
                onGameFinished={this.gameFinished} />
        } else {
            return null;
        }
    }
}
