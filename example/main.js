'use strict';

const view = require('./view');

const Stator = require('../stator');

var element = document.body;

var state = new Stator(element);

state.observe('keyup', ev => ({input: ev.target.value}), function (state, action) {
  state.input = action.input;
  return state;
});

state.observe('submit', ev => ev.preventDefault(), function (state, action) {
  state.todos.push([state.input]);
  state.input = '';
  return state;
});

state.observe('delete', ev => ({index: ev.index}), function (state, action) {
  state.todos.splice(action.index, 1);
  return state;
});

view.init(element, state.initialState);

state.stream.onValue(state => view.update(state));
