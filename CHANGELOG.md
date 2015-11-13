# v0.1

In the first implementation the accumulator function had [a big switch statement](https://github.com/jessehattabaugh/stator/blob/master/index.js#L33) where each event type performed a different mutation to the state. Then when I decided I needed to simplify the DOM event objects I had [a similarly large switch statement](https://github.com/jessehattabaugh/stator/blob/master/index.js#L17) in the `translate` function. Given that I also had [an array of event types](https://github.com/jessehattabaugh/stator/blob/master/index.js#L9) to set up listeners for this started to feel redundant. 

So I decided to change the API and add [the `observe` function](https://github.com/jessehattabaugh/stator/blob/per-event-api/stator.js#L39) to the Stator class. This function takes an eventType to listen to, along with an `accumulator` that handles just the mutations that that event causes to the state. Additionally it can take a `transformer` function which transforms the DOM event object into a serializable object. I feel like [this is a simpler API](https://github.com/jessehattabaugh/stator/blob/per-event-api/example/main.js#L11) since the user can register an event type and all it's handler functions at the same time. 

The caveat to this approach is that each eventType must have a separate effect on the state. This might lead to redundence in some events that need to mutate the state in similar ways. Currently, each event can only be handled in a single way, but that can be improved.

In order to accomplish this refactor the `observe` method needed to add event streams to a Stator's state output stream after it's created. Unfortunately [RxJS Observables are immutable](https://medium.com/@andrestaltz/2-minute-introduction-to-rx-24c8ca793877). Luckily [Bacon.js](https://github.com/baconjs/bacon.js) offers [the Bus class](https://github.com/baconjs/bacon.js#bus) which can have additional streams plugged into it after it's creation! It was relatively simple to swap RxJS out since Bacon.js offers a nearly similar [`scan` function](https://baconjs.github.io/api.html#observable-scan). 

I removed the localStore/undo stuff to simplify things, but plan to add it back using some kind of accumulator enhancer thing, [like Redux does](http://rackt.org/redux/docs/recipes/ImplementingUndoHistory.html#meet-reducer-enhancers).

# v0

I've been reading about Redux, and how it can do undo/redo and replaying of actions to recreate a state. That sounds pretty cool, but I'm not down with all the strange concepts like dispatching action creators and subscribing to listeners or whatever. Lately I've been thinking that maybe we're just trying to reinvent the Event wheel.

So I set out to implement a system similar to Redux by accumulating regular DOM events into a state object. I'm using RxJS to merge all the events I'm interested in into an Observable, then running an accumulator function over them using the [`scan()`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/scan.md) function, which is similar to `reduce()` but emits the results each time. So after each event I get a new state object which I pass to a [Virtual-DOM](https://github.com/Matt-Esch/virtual-dom) render function.

At first I was just passing the events to the accumulator, but when I tried to store them in `localStorage` I realized they are huge objects. So I introduced a function called  `translate()` that takes an event and returns an object with just the parts that are interesting to the accumulator. It's these returned objects, which I call actions, that I'm storing in `localStorage`.

On page load I load all the stored actions, and reduce them with the accumulator. This gives me the initial state for the page's first render. To undo, I simply pop one action of the stack and reduce again. Pretty easy.
