import {useDeps, composeAll, composeWithTracker, compose} from 'mantra-core';

import Main from '../components/main.jsx';

export const composer = ({context}, onData) => {
  const {Meteor, Collections, game} = context();
  var logo, playButton,highscore,tm;
  
  var Menu = {
    preload : function() {
      game.load.image('menu', '/assets/main_menu/logo.png');
      game.load.image('playButton', '/assets/main_menu/play.png');
      game.load.image('highscore', '/assets/main_menu/highscore.png');
      game.load.image('tm', '/assets/main_menu/tm.png');
    },
    create: function () {
      logo = this.add.sprite(200,50,'menu');
      tm = this.add.button(560,120,'tm', this.cheatEngine, this);
      playButton = this.add.button(275,290,'playButton', this.startGame, this);
      highscore = this.add.button(275,350,'highscore', this.showHighscore, this);
    },
    startGame: function () {
      console.log("Game Started");
      this.state.start('Game');
    },
    showHighscore: function() {
      console.log("View Highscore");
      this.state.start('Highscore');
    },
    cheatEngine: function() {
      console.log("Enter Cheat");
      this.state.start('CheatEngine');
    },
  };

  game.state.add('Menu', Menu);
  game.state.start('Menu');
  onData(null, {});
};



export const depsMapper = (context, actions) => ({
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Main);
