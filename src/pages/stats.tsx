import React, { Component } from "react";
import Loading from "../components/Loading";
import Statistics from "../models/Statistics";

interface State {
    loading: boolean;
    stats?: Statistics;
}

// TODO: Add pretty graphs :)
export default class Stats extends Component<{}, State> {

    state: Readonly<State> = {
        loading: true,
        stats: undefined,
    };

    async componentDidMount() {
        let stats = await Statistics.GetStats();
        this.setState({stats, loading: false});
    }

    public render() {
        if (this.state.loading) {
            return <Loading />
        }
        if (this.state.stats && this.state.stats!.gamesPlayed === 0) {
            return <div style={{ margin: '0px 16px' }}>
                <h1>Statistics!</h1>
                <p>
                    No Games Found! Play some games and come back too see how
                    good you are!
                </p>
            </div>
        }
        return (
            <div style={{ margin: '0px 16px' }}>
                <h1>Stats!</h1>
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
                        InComplete Games: <strong>{this.state.stats!.inprogress}</strong>
                    </li>
                    <li>
                        Average Number of Moves during losses: <strong>{this.state.stats!.averagesMovesPerLoss}</strong>
                    </li>
                    <li>
                        Average Number of Moves during win: <strong>{this.state.stats!.averagesMovesPerWin}</strong>
                    </li>
                    <li>
                        Average Number of Moves during total: <strong>{this.state.stats!.averageNumberOfMoves}</strong>
                    </li>
                    <li>
                        Average time for losses: <strong>{this.state.stats!.averageTimePerLoss}</strong>
                    </li>
                    <li>
                        Average time for win: <strong>{this.state.stats!.averageTimePerWin}</strong>
                    </li>
                    <li>
                        Average time for total: <strong>{this.state.stats!.averageTime}</strong>
                    </li>
                    {/* <li>
                        Average Number of Invisible Pieces during loss: <strong>{this.state.stats!.averageInvisiblePiecesPerLoss}</strong>
                    </li> */}
                </ul>
            </div>
        );
    }
}
