'use strict';

const Bacon = require('baconjs');

module.exports = Stator;

/** Stator - constructs an object that can subscribe to DOM events on an element 
* and transform a state object in response. 
* @constructor
*/
function Stator(element) {
  this._root = element;
  var _accumulators = {};
  var _transformers = {};
  this.initialState = {type:'', todos: []};
  
  // event streams will be added to this by observe
  var _bus = new Bacon.Bus();
  
  /** stream - an observable property which emits a state object after every event */
  this.stream = _bus.scan(this.initialState, function (previousState, ev) {
    
    // transform the event into an action using the user supplied transformer
    let action = Object.assign({type: ev.type}, _transformers[ev.type](ev));
    
    // transform the previous state using the user supplied accumulator 
    return _accumulators[ev.type](previousState, action);
    
  });
  
  /** observe - registers an event listener, along with an event transformer, 
  * and an action accumulator that will be run when the event occurs.
  * @param type (string), the event type to listen for
  * @param transformer (function), takes an event and returns an action to pass 
  * to the accumulator
  * @param accumulator (function), takes the previous state, and an action and 
  * returns a new state
  */
  this.observe = function (type, transformer, accumulator) {
    _bus.plug(Bacon.fromEvent(this._root, type));

    // todo: push these onto a stack so that there can be multiple events of each type
    _transformers[type] = transformer;
    _accumulators[type] = accumulator;
  };

}
