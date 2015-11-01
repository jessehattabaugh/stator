# Stator

I've been reading about Redux, and how it can do undo/redo and replaying of actions to recreate a state. That sounds pretty cool, but I'm not down with all the strange concepts like dispatching action creators and subscribing to listeners or whatever. Lately I've been thinking that maybe we're just trying to reinvent the Event wheel.

So I set out to implement a system similar to Redux by accumulating regular DOM events into a state object. I'm using RxJS to merge all the events I'm interested in into an Observable, then running an accumulator function over them using the [`scan()`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/scan.md) function. `[scan()](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/scan.md)` is similar to `reduce()` but it emits the results each time. So after each event I get a new state object which I pass to a [Virtual-DOM](https://github.com/Matt-Esch/virtual-dom) render function.

At first I was just passing the events to the accumulator, but when I tried to store them in `localStorage` I realized they are huge objects. So I introduced a function called  `translate()` that takes an event and returns an object with just the parts that are interesting to the accumulator. It's these returned objects, which I call actions, that I'm storing in `localStorage`.

On page load I load all the stored actions, and reduce them with the accumulator. This gives me the initial state for the page's first render. To undo, I simply pop one action of the stack and reduce again. Pretty easy.

# Live Example

> [Todo List](http://stator.surge.sh)

# todo
* [x] create an event stream
* [x] accumulate events into a state object
* [x] render state to a vdom element
* [x] delete items
* [x] record events to localstorage
* [x] replay events when the user reloads the page
* [x] undo last event
* [ ] move localstorage stuff to a middleware
* [ ] do an API call
