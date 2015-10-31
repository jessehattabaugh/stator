# rxdux

I've been reading about Redux, and how it can do undo/redo and replaying of actions to recreate a state. That sounds pretty cool, but I'm not down with all the strange concepts like dispatching action creators and subscribing to listeners or whatever. Lately I've been thinking that maybe we're just trying to reinvent the Event wheel.

So I set out to implement a system similar to Redux by accumulating regular DOM events into a state object. I'm using RxJS to merge all the events I'm interested in into an Observable, then running a reducer function over them using the scan() function. scan() is similar to reduce() but it emits the results each time. So after each event I get a new state object which I pass to a Virtual-DOM render function.

# todo
* [x] create an event stream
* [x] accumulate events into a state object
* [x] render state to a vdom element
* [x] delete items
* [ ] record events to localstorage
* [ ] replay events when the user reloads the page
* [ ] undo last event
