import React, { Component } from "react";
import { Statistics } from "../models/Types";
import Games from "../models/Games";
import Loading from "../components/Loading";

interface State {
    loading: boolean;
    stats?: Statistics;
}

// TODO: Update the app to calculate the stats on the fly
// What I mean by that is at the end of every game, re-compute all of
// the statistics and
// TODO: Add pretty graphs :)
export default class Stats extends Component<{}, State> {

    state: Readonly<State> = {
        loading: true,
        stats: undefined,
    };

    async componentDidMount() {
        let stats = await Games.GetGameStatistics();
        this.setState({stats, loading: false});
    }

    public render() {
        if (this.state.loading) {
            return <Loading />
        }
        return (
            <div style={{ margin: '0px 16px' }}>
                <h1>Stats!!!</h1>
                <ul>
                    <li>
                        Games Played: <strong>{this.state.stats!.gamesPlayed}</strong>
                    </li>
                    <li>
                        Wins: <strong>{this.state.stats!.wins}</strong>
                    </li>
                    <li>
                        Losses: <strong>{this.state.stats!.losses}</strong>
                    </li>
                    <li>
                        InComplete Games: <strong>{this.state.stats!.incomplete}</strong>
                    </li>
                    <li>
                        Average Number of Moves during losses: <strong>{this.state.stats!.averageNumberOfMovesLoss}</strong>
                    </li>
                    <li>
                        Average Number of Moves during win: <strong>{this.state.stats!.averageNumberOfMovesWin}</strong>
                    </li>
                    <li>
                        Average Number of Moves during total: <strong>{this.state.stats!.averageNumberOfMovesTotal}</strong>
                    </li>
                    <li>
                        Average time for losses: <strong>{this.state.stats!.averageTimeTakenLoss}</strong>
                    </li>
                    <li>
                        Average time for win: <strong>{this.state.stats!.averageTimeTakenWin}</strong>
                    </li>
                    <li>
                        Average time for total: <strong>{this.state.stats!.averageTimeTakenTotal}</strong>
                    </li>
                    <li>
                        Average Number of Invisible Pieces during loss: <strong>{this.state.stats!.averageNumberOfInvisiblePieces}</strong>
                    </li>
                </ul>
            </div>
        );
    }
}
