<!-- 00_intro.md-->


## Mutable or Immutable? <br/> Let's do both!

<small>
React Alicante 2017

Mattia Manzati - @MattiaManzati
</small>

---

Is State Management in 2017 easy?
.appear[
    ### NO!
]

???
State Management is one of the hardest and most discussed topic over the React community.

---

How to do state management with React?
.appear[
    ## Redux
]
.appear[
    ## MobX
]

???

If you start googoling state management in React you'll end up finding either a Redux or a MobX article for sure, but you know, if you are pretty new to React, or don't have friends to ask to, your first question will be for sure...

---

class: ticks3

## Which one to pick?

.appear[
    `redux || mobx`
]
.appear[
    `itDepends`
]

???

Which one to Pick? 

---

## Comparing the opposite patterns

.appear[
    `redux === immutable`
]
.appear[
    `mobx === mutable`
]

???

Those libraries are based on opposite concepts, with their pros and cons...
Redux base all its architecture on immutable data, whilst MobX uses the power of mutable observable objects.

---

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
    @observable name: string = ""
    @observable done: boolean = false

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
    @computed snapshot(){
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

<img src="img/react.svg" width="50" /> It's React

<img src="img/git.png" width="50" /> It's Git

...but for data


???

Today we'll discover together MobX-State-Tree, a library that tries to merge the best of both worlds, for an optimal developer experience.

---

## MobX-State-Tree
Getting the best of both worlds!

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

---

## Composing Models
???

Although, out application is'nt just a set of entities, but rather a tree of them.
Somewhere we need to tell our application how to compose them, in order to create our tree.
--

```javascript
import {types} from "mobx-state-tree"

const TodoStore = types.model("TodoStore", {
    todos: types.array(Todo)
})
```
???
In MST this can be easily accomplished through type composition.

---

```javascript
import {types} from "mobx-state-tree"

const store = TodoStore.create({
    todos: [{name: "Work", done: true}]
})

assertTrue(store.todos[0].name === "Work")
```
???
Features like snapshots will continue to work as expected, for example here we can see that a todo will be correctly created when restoring from a snapshot.

---

```javascript
import {types} from "mobx-state-tree"

const store = TodoStore.create({
    todos: [{name: "Work", done: true}]
})

assertTrue(store.todos[0].done === true)

store.todos[0].toggle()

assertTrue(store.todos[0].done === false)
```
???
Methods attached to our model will continue to work as expected.

---

```javascript
import {types} from "mobx-state-tree"

const store = TodoStore.create({
    todos: [{name: "Work", done: true}]
})

store.todos.push({name: "Speak at React Alicante"})
store.todos[1].toggle()
```
???
Given the provided type information, we could even pass snapshots as property of a given model instance.
MST will lookup which model type should live at that part of our state shape, and create an instance with the given snapshot automatically.

---

## Types
???
The Type System one of the focal point of MST that allows having the best features of both mutable and immutable world.

--

```javascript
const Todo = types.model({
    name: "",
    done: false
})
```

???

When I showed you how to define a model in MST, I used a syntax shorthand that allows passing in primitives to infer their types and use the provided value as default.
--
...is an alias of...

```javascript
const Todo = types.model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false)
})

```
???
In the given example MST was inferring string and boolean types.

---

## Typechecking

```javascript
const incorrect = Todo.create({ name: false, done: 1})
```
```
[mobx-state-tree] Error while converting 
   `{"name":false,"done":1}` to `Todo`:
at path "/name" value `false` is not assignable 
   to type: `string` (Value is not a string).
at path "/done" value `1` is not assignable 
   to type: `boolean` (Value is not a boolean).
```
???
The first obvious benefits of having types is that MST can now perform sanity checks over the provided snapshots.
They will be fired even when we change a property of a model instance, so this ensure runtime type checking of our data.

---
background-image: url(img/autocompletion.png)

???
We also provide TypeScript typings that are automatically inferred from the model definition. This allows to use TypeScript compile time typechecks without using any TS syntax.
If someone wants to open a PR for flow support, it's welcome!

---

`
runtime && buildtime
`
.appear[
`
"developerHappy"
`
]

---

```
enumeration
model
compose
reference
union
optional
literal
maybe
refinement
string
boolean
number
Date
map
array
frozen
identifier
late
undefined
null
```

???

And MST provides lot of utility types. Most of them were inspired by the work of Giulio Canti over the tcomb library that provides type combinators.

---

## Types
- Provides information about how to de/serialize the state
- Perform runtime (& buildtime) typechecks

---

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