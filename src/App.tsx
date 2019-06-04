import React, { lazy, Suspense } from 'react';
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router';
import Loading from './components/Loading';

import Home from './pages/home';
import Footer from './components/Footer';
import Header from './components/Header';
const CustomGameForm = lazy( () => import('./pages/custom-game'));
const About = lazy( () => import('./pages/about'));
const GameMenu = lazy( () => import('./pages/game-menu'));
const HowToPlay = lazy( () => import('./pages/how-to-play'));
const Settings = lazy( () => import('./pages/settings'));
const Game = lazy( () => import('./pages/game'));
const GameWon = lazy( () => import('./pages/game-won'));
const Stats = lazy( () => import('./pages/stats'));



const App: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
    if (props.location.pathname === "/") {
        document.getElementById("root")!.style.gridTemplateRows = "0px 1fr 60px";
    } else {
        document.getElementById("root")!.style.gridTemplateRows = "60px 1fr 60px";
    }
    return (
        <React.Fragment>
            <Header />
            <div id="page" className="page">
                <Suspense fallback={<Loading />}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/about" component={About} />
                        <Route path="/menu/custom" component={CustomGameForm} />
                        <Route path="/menu" component={GameMenu} />
                        <Route path="/how-to-play" component={HowToPlay} />
                        <Route path="/settings" component={Settings} />
                        <Route path="/stats" component={Stats} />

                        {/* This one is special */}
                        {/* https://stackoverflow.com/questions/41474134/nested-routes-with-react-router-v4-v5 */}
                        <Route path="/game/:id/game-won" component={GameWon} />
                        <Route path="/game/:id" component={Game} />
                    </Switch>
                </Suspense>
            </div>
            <Footer />
        </React.Fragment>
    );
}

export default withRouter(App);
