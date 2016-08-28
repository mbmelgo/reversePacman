import * as Collections from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker';

window.PIXI = require( '/public/phaser/build/custom/pixi' )
window.p2 = require( '/public/phaser/build/custom/p2' )
window.Phaser = require( '/public/phaser/build/custom/phaser-split' )

export default function () {
  return {
    Meteor,
    FlowRouter,
    Collections,
    LocalState: new ReactiveDict(),
    Tracker
  };
}
