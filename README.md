# Reverse Pacman

A game developed using Phaser as a game engine combined with MeteorJS

Reverse Pacman requires [Node.js](https://nodejs.org/), [MeteorJS](https://www.meteor.com/) to run.

### Running the App
Version 1
```sh
$ cd FontResizeEmulation
$ npm install
$ npm run start
```
Version 2
```sh
$ cd .demeteorized/bundle/programs/server
$ npm install
$ MONGO_URL=mongodb://localhost:27017/test PORT=8080 ROOT_URL=http://localhost:8080 npm start
```

### Game Info

The game is just like pacman but in reverse. Since instead of having 1 pacman and 4 ghost, this game has 4 pacman and 1 ghost. And instead of the player controlling pacman, the player now controls the ghost. 

### Game Objective

The objective of the player is to catch all 4 pacmans before the timer runs out or before all the coins have been eaten by pacman. And the top 10 players who have the fastest time will be place in the hall of fame.

### Player Controls

The player will make use of the keyboard keys:
* W - Player will move up
* S - Player will move down
* A - Player will move left
* D - Player will move right

Use mouse to interact to the menu of the game
