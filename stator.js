'use strict';

const rx = require('rx');

module.exports = Stator;

function Stator(element) {

  this.element = element;
  this.accumulators = [];
  this.translators = [];

  // reset localStorage
  //localStorage.setItem('actions', JSON.stringify([]));

  // load old actions from localstorage
  //let actions = JSON.parse(localStorage.getItem('actions'));
  let actions = [];

  // if there were none, create an empty array to store them in
  //if (Object.prototype.toString.call(actions) !== '[object Array]')
  //  actions = [];

  this.initialState = actions.reduce(function (state, action) {
    return this.accumulators[action.type](state, action);
  }, {type:'', todos: []});

  this.stream = rx.Observable.empty()
    .scan(function (prev, ev) {
      console.info('event occurred');
      // translate the event into an action
      let action = {type: ev.type}.append(this.translators[ev.type](ev));

      // todo: move undo code to method so users can chose their own events
      //if (action.type == 'undo') {
        //let undid = actions.pop();
        //console.log(`undoing ${undid.type}`);
        //localStorage.setItem('actions', JSON.stringify(actions));
        //return actions.reduce(accumulator, {type:'', todos: []});
      //}
      //else {
        //actions.push(action);
        //localStorage.setItem('actions', JSON.stringify(actions));
        return this.accumulators[action.type](prev, action);
      //}

    }, this.initialState);
}

Stator.prototype.observe = function (type, translate, accumulate) {
  console.dir(arguments);
  this.stream.merge(rx.Observable.fromEvent(this.element, type));

  // todo: push these onto a stack so that events can have multiple
  this.translators[type] = translate;
  this.accumulators[type] = accumulate;
}
