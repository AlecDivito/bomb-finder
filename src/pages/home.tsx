import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./home.css"
import Games from "../models/Games";
import Loading from "../components/Loading";
import isInstalled from "../util/isInstalled";

interface State {
    loading: boolean;
    installButton: boolean;
    gameId?: string;
}

export default class Home extends Component<{}, State> {

    private installPrompt: any = null;

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: true,
            installButton: true,
            gameId: undefined,
        };
    }

    async componentDidMount() {
        const game = await Games.GetLastPlayedGame();
        if (game) {
            this.setState({ loading: false, gameId: game.id });
        } else {
            this.setState({ loading: false });
        }
        console.log("Listening for Install prompt");
        window.addEventListener('beforeinstallprompt', (e) => {
            // older browsers
            e.preventDefault();
            console.log("Install Prompt fired");
            console.log(e);
            // See if the app is already installed, in that case, do nothing
            if (isInstalled()) {
                return false;
            }
            // Set the state variable to make button visible
            this.setState({ installButton: true });
        });
    }

    installApp = async () => {
        console.log('installing');
        if (!this.installPrompt) {
            return false;
        }
        console.log('we have inialization');
        this.installPrompt.prompt();
        const outcome = await this.installPrompt.prompt.userChoice;
        if (outcome.outcome === 'accepted') {
            console.log("App Installed");
        } else {
            console.log("App not installed");
        }
        // Remove the event reference
        this.installPrompt = null;
        // Hide the button
        this.setState({ installButton: false });
    }

    public render() {
        if (this.state.loading) {
            return <Loading />
        }
        return (
            <div className="home">
                <div className="home__header">
                    <h1 className="home__header--center">Bomb Finder!</h1>
                </div>
                <ul className="home__list">
                    {
                        (this.state.gameId)
                            ? <li className="home__list__item">
                                <Link to={`/game/${this.state.gameId}`}>CONTINUE</Link>
                            </li>
                            : null
                    }
                    <li className="home__list__item">
                        <Link to="/menu">NEW GAME</Link>
                    </li>
                    <li className="home__list__item">
                        <Link to="/stats">STATISTICS</Link>
                    </li>
                    <li className="home__list__item">
                        <Link to="/about">ABOUT</Link>
                    </li>
                    {
                        (this.state.installButton)
                        ? <li className="home__list__item">
                            <span onClick={this.installApp}>INSTALL APP</span>
                        </li>
                        : null
                    }
                </ul>
            </div>
        );
    }
}
