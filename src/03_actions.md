## Actions

???
Up to now we have spoken about our data, but let's take a closer look at data transformation.
---


## Redux

```javascript
const TOGGLE_TODO = 'todo/TOGGLE_TODO'
export function toggleTodo(){
    return { type: TOGGLE_TODO }
}
```

???

In Redux actions are just function that provides object messages that needs to be dispatched to our store to start a reducer execution.

--

## Redux

```javascript
const initialState = {name: "", done: false}
function todoReducer(state = initialState, action){
    if(!action) return state

    switch(action.type){
        case TOGGLE_TODO:
            return ({...state, done: !state.done})
        default:
            return state
    }
}
```

???

The reducer will eventually produce a new state and our view will be updated.

This flow is nice, because as you may already know this provides a serializable stream of actions.
---

## Redux

```javascript
const initialState = {name: 'Work!', done: false}
const action = {type: 'todo/TOGGLE_TODO'}
const newState = todoReducer(initialState, action)
// => {name: 'Work!', done: true}
```

???
If your reducer are pure functions, you can even predict how your state will look like.

And that's really nice because it means that you can record the list of your actions and replay it locally, even if reducer is'nt exactly the same.

This allows you to record your customer actions, save on some storage when an error occours, and use it to fix the bug in your test env.

This is the only way to produce a new state.

---

## MobX

```javascript
class Todo {
    // ...

    @action toggle(){
        this.done != this.done
    }
}
```

???

MobX allows to define actions by just decorating them with the action decorator/function.

--


```javascript
work.toggle()
work.done = true
```

???

Unfortunately this is'nt the only way to change your state; by default you can also change observable properties outside of any action.

---
### MobX 
.appear[No action stream]

### Redux
.appear[Serializable, replayable action stream]

---

## MobX-State-Tree
- State can be modified only through actions by default
- Actions can change only its subtree

---

## Actions

```javascript
store.todos[0].name = "Sleep"
```

.appear[
```
Error: Cannot modify 'Todop@/todos/0',
the object is protected and can only 
    be modified by using an action.
```
]

---

## Automatic action descriptors
```javascript
import {onAction} from "mobx-state-tree"

onAction(store, call => console.log(call))

store.todos[0].toggle()
// => {path: "/store/todos/0", name: "toggle", args: []}

```
???
MST will also produce automatically an action descriptor everytime you call an action on your store.

This gives you all the benefits of redux action stream.
---
## Applying an action back
```javascript
import {applyAction} from "mobx-state-tree"

applyAction(
    store, 
    {path: "/store/todos/0", name: "toggle", args: []}
)

```
???
To apply back an action descriptor you just need to call applyAction over your store.