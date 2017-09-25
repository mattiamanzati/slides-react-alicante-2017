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

## Reactions/Autorun

```javascript
import {reaction} from "mobx"

reaction(
    () => store.pending, 
    pending => {
        if(pending === 0){
            console.log("Horray! Nothing left to do!")
        }
    }
)
```

???

Thanks to MobX, we also get for free reactions, which allow us to automatically perform actions whenever a value changes.

Behind the scenes this means that you can use the mobx-react package to connect your store to your react components.

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

## Patches
- Fine grained serialized event
- Implements RFC 6902
