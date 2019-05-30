import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Loading from './components/Loading';

import Home from './pages/home';
const About = lazy( () => import('./pages/about'));
const GameMenu = lazy( () => import('./pages/game-menu'));
const HowToPlay = lazy( () => import('./pages/how-to-play'));
const Settings = lazy( () => import('./pages/settings'));
const Game = lazy( () => import('./pages/game'));
const GameWon = lazy( () => import('./pages/game-won'));
const Stats = lazy( () => import('./pages/stats'));



const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/play" component={GameMenu} />
          <Route path="/how-to-play" component={HowToPlay} />
          <Route path="/settings" component={Settings} />
          <Route path="/stats" component={Stats} />

          {/* This one is special */}
          <Route path="/game/:id" component={Game} />
          <Route path="/game/:id/game-won" component={GameWon} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
