
## Shaping the data

???

Let's start by giving a look at how we define our data shape.

---

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

In Redux the reducer could be considered the core concept of data modeling, and that's predictable.
Since we are dealing with immutable data, we could not change an instance, so the focus of our code will
always be the data transformation rather than it's shape.
Due to that, our data shape is kinda lost in all of that code.

---

## Redux

```javascript
const TOGGLE_TODO = 'todo/TOGGLE_TODO'
export function toggleTodo(){
    return { type: TOGGLE_TODO }
}
```

???

And while we are at it, we could note that reducer and actions are'nt colocated, and that IMHO could potentially make our code less readable.

---

## MobX

```javascript
class Todo {
    @observable name = ""
    @observable done = false

    @action toggle(){
        this.done != this.done
    }
}
```

???

Most of the people using MobX up to now used ES6 classes up to now, and that's nice. It lets you write clean code that express both data shape and actions in the same place making it highly readable.

---

### MobX 
.appear[Pros: Data shape is clear]

### Redux
.appear[Cons: Data shape is kinda lost]

---

## Data Rehydration

```javascript
const serverData = { 
    name: "Attend React Alicante", 
    done: true
}
```

---

### Redux

```javascript
const newState = todoReducer(serverData, toggleTodo())
// newState.done === false
```

???

Since Redux uses immutable objects, they won't contain any application business logic like actions, computeds, etc...
So it is really easy to rehydrate data onto our store, you just need to pass it onto your reducer.
---

### MobX

```javascript
class Todo {
    // ...
    @computed get snapshot(){
        return {
            name: this.name,
            done: this.done
        }
    }

    @action applySnapshot(snapshot){
        this.name = snapshot.name
        this.done = snapshot.done
    }
}
```

???

Unfortunately, MobX uses classes, so it won't accept our server data, we need to define a property and a method to manage de/serialization.

---
### MobX 
.appear[Cons: Use classes, internal state, hard de/serialization]

### Redux
.appear[Pros: Use plain objects, external state, no need for de/serialization]

---

## Redux state snapshots are awesome!
- Allow time travel
- Make testing easier
- Better dev tools

.appear[
## Such benefits... 
]

.appear[
## in MobX such LOC cost!
]

---

## What if we could get them for free?
.appear[We need to know the data shape]

.appear[We need de/serialization fn() for each shape]

---

`redux && mobx`
.appear[
    `true`
]

???

Would'nt be awesome to get the best of both world?

---

## MobX-State-Tree
Getting the best of both worlds!

???

Today we'll discover together MobX-State-Tree, a library that tries to merge the best of both worlds, for an optimal developer experience.

---

### Defining data shape
```javascript
import {types} from "mobx-state-tree"

const Todo = types.model({
    name: "",
    done: false
})
```

???

In the center of MST there is the concept of a model.
Models define the base building unit for our application, just like React components do.

---

### Defining data shape
```javascript
import {types} from "mobx-state-tree"

const Todo = types.model({
    name: "",
    done: false
})
.actions(self => ({
    toggle(){
        self.done != self.done
    }
}))
```

???
Each model could be optionally enriched with other kind of informations, such actions.
This gives a clean and readable definition of our data shape, and allows colocation of actions.

---

### MobX-State-Tree
Data shape is clear

Actions are colocated

---
### Creating a model instance
```javascript
const work = Todo.create()
work.toggle()
```

???

But now that we have defined our data shape, how we create a model instance to use and connect to our application?
That's really easy, given our model definition, we just type in create to get a new instance with the provided defaults.

---

### Getting an instance snapshot
```javascript
import {getSnapshot} from "mobx-state-tree"

const serializedData = getSnapshot(work)
// serializedData = {name: "Work!", done: false}
```

???

Thanks to those information, we could produce immutable snapshots for free out of mutable objects.
---

### Creating an instance from a snapshot
```javascript
const work = Todo.create(serverData)
```

### Updating an instance from a snapshot
```javascript
import {applySnapshot} from "mobx-state-tree"

applySnapshot(work, serverData)
```

???
We could also create new objects given a snapshot, or update existing ones to match the given snapshot.

---


### How to listen for snapshot changes?
```javascript
import {onSnapshot} from "mobx-state-tree"

onSnapshot(work, newSnapshot => {
    console.log("New store snapshot:", newSnapshot)

    window.localStorage.setItem(
        "todo", 
        JSON.stringify(newSnapshot)
    )
})
```

???

Thanks to MobX reactive data structures used in MST, we could also subscribe to any change of a model snapshot, and perform anything we want with that.

---

## What about fancy time travelling?

```javascript
import {onSnapshot, applySnapshot} from "mobx-state-tree"

const appStates = []
onSnapshot(work, newSnapshot => 
    appStates.push(newSnapshot)
)

function travelAt(index){
    applySnapshot(store, appStates[index])
}
```

???
With all those bounties, implementing time travel becames pretty straight forward.
We just use a list of previous snapshots, push onto the list every new snapshot, and to travel back we just need to reapply the snapshots in the list in the desidered order.

---

### MobX-State-Tree

- creates MobX observable objects

--
- produces snapshots automatically

--
- can create observable objects from snapshot

--
- can update observable objects from snapshot

--
- allows time travelling
