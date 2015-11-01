'use strict';

const rx = require('rx');

module.exports = Stator;

function Stator(element, events, translator, accumulator) {
  // reset localStorage
  //localStorage.setItem('actions', JSON.stringify([]));

  // load old actions from localstorage
  let actions = JSON.parse(localStorage.getItem('actions'));

  // if there were none, create an empty array to store them in
  if (Object.prototype.toString.call(actions) !== '[object Array]')
    actions = [];

  this.initialState = actions.reduce(accumulator, {type:'', todos: []});

  this.stream = rx.Observable.merge(events.map(eventType => rx.Observable.fromEvent(element, eventType)))
    .scan(function (prev, ev) {

      // translate the event into an action
      let action = translator(ev);

      // todo: move undo code to method so users can chose their own events
      if (action.type == 'undo') {
        let undid = actions.pop();
        console.log(`undoing ${undid.type}`);
        localStorage.setItem('actions', JSON.stringify(actions));
        return actions.reduce(accumulator, {type:'', todos: []});
      }
      else {
        actions.push(action);
        localStorage.setItem('actions', JSON.stringify(actions));
        return accumulator(prev, action);
      }
    }, this.initialState);
}
