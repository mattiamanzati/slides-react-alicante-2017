## Observability

???

Back to MobX & Redux, observability is one of the huge differencies between the two libraries.

---
### MobX 
.appear[Fine grained observability]

### Redux
.appear[If reference changes, value changed]

---

### MobX-State-Tree
- fine grained observability
- if value changes, new snapshot emits

???
MST get the best of both.

---

## Derived Values

???

Another kind of value that we will eventually encounter in the state of our application are derived values.
---

## Redux

```javascript
const getPending = 
    todos => todos.filter(todo => !todo.done).length
```

.appear[
```javascript
const getPending = 
    memoize(todos => todos.filter(todo => !todo.done).length)
```
]

???
In redux derived values are expressed through selectors.
As we know, selectors are just functions that takes in a part of the state and return a derived value out of it.
It's left to the developer how to optimize those function execution to avoid wasting performance on them.

---

## MobX

```javascript
class TodoStore{
    // ...

    @computed get pending(){
        return todos.filter(todo => !todo.done).length
    }
}
```

???

In the MobX world memoization of derived values is done automatically. 

Derived values are usually expressed through class getters, and they keep track of observed values.

Each time one of the observed value change, the computed value is updated and memoized again.

---
### MobX 
.appear[Automatically memoized derived values]

### Redux
.appear[Manually memoized values]

---

## MobX-State-Tree

```javascript
import {types} from "mobx-state-tree"

const TodoStore = types.model("TodoStore", {
    todos: types.array(Todo)
}).views(self => ({
    get pending(){
        return self.todos.filter(todo => !todo.done).length
    }
}))
```

???

Since MST uses MobX instances, we can provide automatically memoized derived values.

They can be easily defined as model views, and MST will automatically memoize and update them based on which model properties are used.

And they are nicely colocated with our data and actions.

---

## Fine grained snapshots? Patches!

```javascript
import {onPatch} from "mobx-state-tree"

onPatch(store, patch => console.log(patch))

store.todos[0].done = false
```
...logs...
```javascript
{op: "replace", path: "/todos/0/done", value: false}
```
???
Another fine grained benefit in MST is patches.

Patches are an immutable representation of fine grained changes, and they are automatically emitted by any MST instance.

---
## Applying patches
```javascript
import {applyPatch} from "mobx-state-tree"

applyPatch(
    store, 
    {op: "replace", path: "/todos/0/done", value: false}
)

assertTrue(store.todos[0].done === false)
```

???

You can also apply them back by using applyPatch.

This allows scenarios like sending patches through a WebSocket connection to provide real-time collaboration.
---

## I did a mistake! Revert back!

```javascript
import {onPatch} from "mobx-state-tree"

onPatch(store, (patch, revertPatch) => console.log(patch, revertPatch))

store.todos.push({name: 'Work!', done: false})
```
...logs...
```javascript
{op: "add", path: "/todos/0", value: {name: 'Work!', done: false}}
{op: "remove", path: "/todos/0", value: {name: 'Work!', done: false}}
```
???
And patches provide more than a simple and lightweight way of producing granular snapshots.

With onPatch function you get for free revert patch for each emitted patch.
---


## I did a mistake! Revert back!
```javascript
let reversePatches = []
let disposer = null

try{
    // subscribe for patches
    disposer = onPatch(
        store, 
        (patch, reversePatch) => 
            reversePatches.push(reversePatch)
    )
    // call some action...
    store.possiblyFailingAction()

}catch(e){
    // revert back!
    applyPatches(store, reversePatches.reverse())
}finally{
    disposer()
}
```

???
Thanks to reverse patches we can implement, almost for free, patterns like reverting any store change if something went wrong.

---

```javascript
let recorderer = recordPatches(store)

try{
    // call some action...
    store.possiblyFailingAction()

}catch(e){
    // revert back!
    recorderer.undo(store)
}finally{
    recorderer.stop()
}
```

???
And since this pattern is really awesome, MST ships by default a patches recorder.

---

```javascript
let recorderer = recordPatches(store)

const store = AppStore.create()
// create a copy of a todo
const todo = Todo.create(getSnapshot(store.todos[0]))
const recorderer = recordPatches(todo)
// let the user do its thing...
todo.toggle()
// ok, time to commit!
recorderer.replay(store.todos[0])

```

???
Patch recorderer even allows to replay the emitted patches over another MST instance!
This allow, for example, to perform editing in a wizard over a copy of the real todo, and when we are done, if all the data passes the checks, we can replay the changes over the real store.

---

## Patches... Git, but for data!
- Fine grained serialized event
- Implements RFC 6902
- both apply and revert patch