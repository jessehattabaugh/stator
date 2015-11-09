'use strict';

const h = require('virtual-dom/h');
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const createElement = require('virtual-dom/create-element');
const ev = require('dom-events');

let parent;
let tree = h();
let rootNode = createElement(tree);

function render(state)  {
  //console.dir(state);
  //console.info('rendering');

  let todos = state.todos.map((todo, i) => h('li', [
    h('span', todo),
    h('a', {
      onclick: e => ev.emit(parent, 'delete', {index:i}),
      style: {float: 'right', color: 'red'}
    }, 'x')
  ]));

  return h('form', [
    h('a', {onclick: e => ev.emit(parent, 'undo')}, 'undo'),
    h('ol', todos),
  	h('input', {value: state.input}),
    h('button', 'add')
  ]);
}

exports.init = function (el, initialState) {
  parent = el;
  tree = render(initialState);
  rootNode = createElement(tree);
  el.appendChild(rootNode);
}

exports.update = function (state) {
  //console.dir(state);
  let newTree = render(state);
  let patches = diff(tree, newTree);
  rootNode = patch(rootNode, patches);
  tree = newTree;
};
