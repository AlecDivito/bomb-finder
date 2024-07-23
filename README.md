## Minesweeper and proxx.app clone

A Minesweeper clone thats went a little over board (or maybe not enough).
Built as a PWA with HTML, CSS, Typescript and React. Features provided by
the browser includes Canvas2d, Indexdb, and vibration.

[Play The Game Now!!!](https://minesweeper.alecdivito.com)


## Project Status

This project is at a finished stage. It is mostly completed and is fully
usable and installable. There are still some small bugs that need to be
fixed but the initial 1.0 release works. A polish wouldn't hurt it. ed.

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed
globally on your machine.

Web Installation:
`npm install`

To Start Server:
`npm run start`

To Visit App:
`localhost:3000`

## Reflections

Originally I wanted to build a simplier clone of Googles proxx.app but what
was supposed to be simple steam rolled into something a little bigger then
I first envisioned. The projected became bigger and bigger as I started adding
new features in the game like game templates, settings, and statistics.

This projects main goal was to experiment with PWA's and reacts implementation
of them. As well as gain some experience working the some of the browser's
internal API's like canvas2d and indexDB.

One of the main challenges I came across was using indexDB for saving games
and other items. There were issues were I couldn't update the store without
deleting it first as well as a poor implementation of a super class to handle
the reading and writing of data. I probably spent 5 days playing with the
implementation of it. It's currently implementation isn't bad but could be better.
I removed it as being a super class and changed it to a singleton. It works well
for creating the database from scratch and I haven't encountered anymore issues with it

At the end of the day this project is a completed project that I'm really proud
to show people. I learnt a lot about chrome dev tools and profiling my performance
code. It was a lot of fun creating the animations and working with canvas2d. Using
react's "create react app" helped a lot to quickly get the project running. I 
can't wait till I have the time to fully polish the game off to how I want it to be.

## Project Screen Shots


![Screen shot of minesweeper game home](https://raw.githubusercontent.com/AlecDivito/web-resume/master/src/data/images/personal/bomb_finder/home.png)

![Screen shot of minesweeper game games](https://raw.githubusercontent.com/AlecDivito/web-resume/master/src/data/images/personal/bomb_finder/create_template.png)

![Screen shot of minesweeper game playing](https://raw.githubusercontent.com/AlecDivito/web-resume/master/src/data/images/personal/bomb_finder/game_in_progress.png)

![Screen shot of minesweeper game winning](https://raw.githubusercontent.com/AlecDivito/web-resume/master/src/data/images/personal/bomb_finder/game_won.png)

![Screen shot of minesweeper game settings](https://raw.githubusercontent.com/AlecDivito/web-resume/master/src/data/images/personal/bomb_finder/settings.png)

![Screen shot of minesweeper game stats](https://raw.githubusercontent.com/AlecDivito/web-resume/master/src/data/images/personal/bomb_finder/stats.png)

![Screen shot of minesweeper game how to play](https://raw.githubusercontent.com/AlecDivito/web-resume/master/src/data/images/personal/bomb_finder/how_to_play.png)





## Resources
Google's Minesweeper game (for insperation):
- https://proxx.app
Codepen for UI element designs
- https://codepen.io
