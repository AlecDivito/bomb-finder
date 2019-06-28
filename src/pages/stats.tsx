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
        const stat = stats![index];
        return (
            <div className="stats">
                <h1 className="stats__header">Stats!</h1>
                <Dropdown
                    value={stats[index].name}
                    items={stats.map(s => s.name)}
                    onChange={this.changeStatistics}/>
                <ul>
                    <li className="center"><strong>{stat.gamesPlayed}</strong> Games Played</li>
                    <li className="stats--chart">
                        <PieChart
                            animate={true}
                            labelStyle={{
                                fontSize: '5px',
                                fontFamily: 'sans-serif',
                                fill: '#121212'
                            }}
                            data={[
                                { value: stat.wins, color: this.getColor(0, 3) },
                                { value: stat.losses, color: this.getColor(1, 3) },
                                { value: stat.inprogress, color: this.getColor(2, 3) },
                            ]}/>
                        <ul>
                            <li style={{backgroundColor: this.getColor(0, 3)}}>
                                Wins ({stat.wins})
                            </li>
                            <li style={{backgroundColor: this.getColor(1, 3)}}>
                                Losses ({stat.losses})
                            </li>
                            <li style={{backgroundColor: this.getColor(2, 3)}}>
                                In Progress ({stat.inprogress})
                            </li>
                        </ul>
                    </li>
                    <li>Average Moves: <strong>{stat.averageMoves}</strong></li>
                    <li>Best Times: <strong>{stat.bestTime}</strong></li>
                    <li>Worst Time: <strong>{toHHMMSS(stat.worstTime)}</strong></li>
                    <li>Average Times: <strong>{toHHMMSS(stat.averageTime)}</strong></li>
                    <li>Total Time Played: <strong>{toHHMMSS(stat.totalTimePlayed)}</strong></li>
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
