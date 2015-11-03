'use strict';

// experiment

const rx = require('rx');

rx.Observable.fromEvent(document, 'click')
  .subscribe(() => alert("this works"));

var ob = rx.Observable.empty();

ob.subscribe(() => alert("this doesn't work"));

// some time later
ob.merge(rx.Observable.fromEvent(document, 'click'));

// experiment

const view = require('./view');

const Stator = require('./stator');

let element = document.body;

let state = new Stator(element);

state.observe('keyup', (ev) => {input: ev.target.value}, function (state, action) {
  state.input = action.input;
  return state
});

state.observe('submit', (ev) => ev.preventDefault(), function (state, action) {
  state.todos.push([state.input]);
  state.input = '';
  return state;
});

state.observe('delete', (ev) => {index: ev.index}, function (state, action) {
  state.todos.splice(action.index, 1);
  return state;
});

view.init(element, state.initialState);

state.stream.subscribe(state => view.update(state));
