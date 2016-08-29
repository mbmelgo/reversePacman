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
      logo = this.add.sprite(0,0,'menu');
      tm = this.add.button(520,160,'tm', this.cheatEngine, this);
      playButton = this.add.button(245,290,'playButton', this.startGame, this);
      highscore = this.add.button(245,350,'highscore', this.showHighscore, this);
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

  var Game = function (game) {
       this.map = null;
       this.layer = null;
       this.ghost = null;
       this.safetile = 11;
       this.gridsize = 30;
       this.speed = 150;
       this.threshold = 3;
       this.marker = new Phaser.Point();
       this.turnPoint = new Phaser.Point();
       this.directions = [ null, null, null, null, null ];
       this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];
       this.current = Phaser.NONE;
       this.turning = Phaser.NONE;
       this.timer = null;
       this.text = null;
   };

   Game.prototype = {
       init: function () {
           this.physics.startSystem(Phaser.Physics.ARCADE);
       },
       preload: function () {
           this.load.image('dot', '/assets/gameSprites/dot.png');
           this.load.image('tiles', '/assets/gameSprites/tiles.png');this.load.spritesheet('ghost', '/assets/gameSprites/ghost.png', 30, 30);
           this.load.tilemap('map', '/assets/gameSprites/map.json', null, Phaser.Tilemap.TILED_JSON);
       },
       create: function () {
           this.map = this.add.tilemap('map');
           this.map.addTilesetImage('pacman-tiles', 'tiles');
           this.layer = this.map.createLayer('Pacman');
           this.layer.resizeWorld();
           this.dots = this.add.physicsGroup();
           this.map.createFromTiles(11, this.safetile, 'dot', this.layer, this.dots);
           this.dots.setAll('x', 8, false, false, 1);
           this.dots.setAll('y', 8, false, false, 1);
           this.map.setCollisionByExclusion([this.safetile], true, this.layer);
           this.ghost = this.add.sprite((12 * 30) + 15, (16 * 30) + 15, 'ghost', 0);
           this.ghost.anchor.set(0.5);
           this.ghost.animations.add('munch', [0, 1, 2, 1], 20, true);
           this.physics.arcade.enable(this.ghost);
           this.ghost.body.setSize(30, 30, 0, 0);
           this.cursors = this.input.keyboard.createCursorKeys();
           this.ghost.play('munch');
           this.move(Phaser.LEFT);
           this.timer = this.time.events.loop(Phaser.Timer.SECOND * 120 , this.gameOver, this);
           this.text = game.add.text(104, 50,"TIMER ");
           this.text.anchor.set(0.5);
           this.text.align = 'center';
           this.text.font = 'Pixeled';
           this.text.fontSize = 15;
           this.text.fontWeight = 'bold';
           this.text.stroke = '#000000';
           this.text.strokeThickness = 6;
           this.text.fill = '#f3c70a';

       },
       checkKeys: function () {
           if (this.cursors.left.isDown && this.current !== Phaser.LEFT){
               this.checkDirection(Phaser.LEFT);
           } else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT){
               this.checkDirection(Phaser.RIGHT);
           } else if (this.cursors.up.isDown && this.current !== Phaser.UP){
               this.checkDirection(Phaser.UP);
           } else if (this.cursors.down.isDown && this.current !== Phaser.DOWN){
               this.checkDirection(Phaser.DOWN);
           } else{
               this.turning = Phaser.NONE;
           }
       },
       checkDirection: function (turnTo) {
           if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile){
              return;
           }
           if (this.current === this.opposites[turnTo]){
               this.move(turnTo);
           } else{
               this.turning = turnTo;
               this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
               this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
           }
       },
       turn: function () {
           var cx = Math.floor(this.ghost.x);
           var cy = Math.floor(this.ghost.y);
           if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold)){
               return false;
           }
           this.ghost.x = this.turnPoint.x;
           this.ghost.y = this.turnPoint.y;
           this.ghost.body.reset(this.turnPoint.x, this.turnPoint.y);
           this.move(this.turning);
           this.turning = Phaser.NONE;
           return true;
       },
       move: function (direction) {
           var speed = this.speed;
           if (direction === Phaser.LEFT || direction === Phaser.UP){
               speed = -speed;
           }
           if (direction === Phaser.LEFT || direction === Phaser.RIGHT){
               this.ghost.body.velocity.x = speed;
           } else{
               this.ghost.body.velocity.y = speed;
           }
           this.ghost.scale.x = 1;
           this.ghost.angle = 0;
           if (direction === Phaser.LEFT){
               this.ghost.scale.x = -1;
           } else if (direction === Phaser.UP){
               this.ghost.angle = 270;
           } else if (direction === Phaser.DOWN){
               this.ghost.angle = 90;
           }
           this.current = direction;
       },
       eatDot: function (ghost, dot) {
           dot.kill();
           if (this.dots.total === 0){
               this.dots.callAll('revive');
           }
       },
       gameOver: function() {
         this.time.events.removeAll();
         console.log("Game Over");
         this.state.start('Menu');
       },
       render: function() {
         var seconds = Math.round((this.time.events.duration / 1000) % 60) ;
         var minutes = Math.round(((this.time.events.duration / (1000*60)) % 60));
         if(seconds<10){
           this.text.setText("TIMER "+minutes+":0"+seconds);
         } else {
           this.text.setText("TIMER "+minutes+":"+seconds);
         }
       },
       update: function () {
           this.physics.arcade.collide(this.ghost, this.layer);
          //  this.physics.arcade.overlap(this.ghost, this.dots, this.eatDot, null, this);
           this.marker.x = this.math.snapToFloor(Math.floor(this.ghost.x), this.gridsize) / this.gridsize;
           this.marker.y = this.math.snapToFloor(Math.floor(this.ghost.y), this.gridsize) / this.gridsize;
           this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
           this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
           this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
           this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);
           this.checkKeys();
           if (this.turning !== Phaser.NONE){
               this.turn();
           }
       }

   };

  game.state.add('Menu', Menu);
  game.state.add('Game', Game);
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
