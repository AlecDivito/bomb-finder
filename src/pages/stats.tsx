import React, { Component } from "react";
import Loading from "../components/Loading";
import Statistics from "../models/Statistics";
import "./stats.css";
import Dropdown from "../components/Dropdown";
import toHHMMSS from "../util/toHHMMSS";

interface State {
    loading: boolean;
    stats: Statistics[];
    index: number;
}

// TODO: Add pretty graphs :)
export default class Stats extends Component<{}, State> {

    state: Readonly<State> = {
        loading: true,
        stats: [],
        index: 0,
    };

    async componentDidMount() {
        let stats = await Statistics.GetAllStatistics();
        console.log(stats); 
        this.setState({stats, loading: false});
    }

    changeStatistics = (e: React.FormEvent<HTMLSelectElement>) => {
        const index = this.state.stats
            .findIndex(s => s.name === e.currentTarget.value);
        this.setState({ index });
    }

    public render() {
        if (this.state.loading) {
            return <Loading />
        }
        if (this.state.stats && this.state.stats!.length === 0) {
            return <div className="stats">
                <h1>Statistics!</h1>
                <p>
                    No Games Found! Play some games and come back too see how
                    good you are!
                </p>
            </div>
        }
        const { index, stats } = this.state
        return (
            <div className="stats">
                <h1 className="stats__header">Stats!</h1>
                <Dropdown
                    value={stats[index].name}
                    items={stats.map(s => s.name)}
                    onChange={this.changeStatistics}/>
                <ul>
                    <li>
                        Games Played: <strong>{stats![index].gamesPlayed}</strong>
                    </li>
                    <li>
                        Graph
                    </li>
                    <li>
                        Average Moves: <strong>{stats![index].averageMoves}</strong>
                    </li>
                    <li>
                        Best Times: <strong>{stats![index].bestTime}</strong>
                    </li>
                    <li>
                        Total Time Played: <strong>{toHHMMSS(stats![index].totalTimePlayed)}</strong>
                    </li>
                </ul>
            </div>
        );
    }
}
