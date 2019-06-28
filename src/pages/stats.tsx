import React, { Component } from "react";
import PieChart from 'react-minimal-pie-chart';
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
                    <li className="stats--chart">
                        <PieChart
                            animate={true}
                            labelStyle={{
                                fontSize: '5px',
                                fontFamily: 'sans-serif',
                                fill: '#121212'
                            }}
                            data={[
                                { value: stats![index].wins, color: this.getColor(0, 3) },
                                { value: stats![index].losses, color: this.getColor(1, 3) },
                                { value: stats![index].inprogress, color: this.getColor(2, 3) },
                            ]}/>
                        <ul>
                            <li style={{backgroundColor: this.getColor(0, 3)}}>
                                Wins ({stats![index].wins})
                            </li>
                            <li style={{backgroundColor: this.getColor(1, 3)}}>
                                Losses ({stats![index].losses})
                            </li>
                            <li style={{backgroundColor: this.getColor(2, 3)}}>
                                In Progress ({stats![index].inprogress})
                            </li>
                        </ul>
                    </li>
                    <li>
                        Average Moves: <strong>{stats![index].averageMoves}</strong>
                    </li>
                    <li>
                        Best Times: <strong>{stats![index].bestTime}</strong>
                    </li>
                    <li>
                        Worst Time: <strong>{stats![index].worstTime}</strong>
                    </li>
                    <li>
                        Average Times: <strong>{toHHMMSS(stats![index].averageTime)}</strong>
                    </li>
                    <li>
                        Total Time Played: <strong>{toHHMMSS(stats![index].totalTimePlayed)}</strong>
                    </li>
                </ul>
            </div>
        );
    }

    private getColor(index: number, segments: number): string {
        const segment = (360 - 200) / segments;
        const color = (index * segment) + 200;
        return `hsl(${color}, 100%, 50%)`;
    }
}
