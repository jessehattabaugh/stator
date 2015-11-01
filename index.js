'use strict';

const view = require('./view');

const Stator = require('./stator');

let element = document.body;

let events = ['keyup', 'submit', 'delete', 'undo'];

let state = new Stator(element, events, translator, accumulator);

view.init(element, state.initialState);

state.stream.subscribe(state => view.update(state));

function translator(ev) {
  var action =  {type: ev.type};
  switch (action.type) {
    case 'keyup':
      action.input = ev.target.value;
      break;
    case 'delete':
      action.index = ev.index;
      break;
    default:
      ev.preventDefault();
  }
  return action;
}

function accumulator(state, action) {
  switch (action.type) {
    case 'submit':
      state.todos.push([state.input]);
      state.input = '';
      break;
    case 'keyup':
      state.input = action.input;
      break;
    case 'delete':
      state.todos.splice(action.index, 1);
      break;
  }
  return state;
}
