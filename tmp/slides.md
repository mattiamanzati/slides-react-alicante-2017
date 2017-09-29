<!-- 00_intro.md-->

---
background-image: url(img/title.jpeg)

---

background-image: url(img/sponsors.jpeg)

---

background-image: url(img/me.png)

---

background-image: url(img/italian.jpg)
background-color: #000000

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
<!-- 01_data_shape.md-->


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

---
<!-- 02_types.md-->


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

## Reconciliation

???
Having a collection of mutable entities onto our store and applying back an immutable snapshot introduces a reconciliation problem.

Let's give it a look by a small example.

--

```javascript
const store = AppStore.create()
const work = Todo.create({id: 1, name: 'Work', done: true})
const sleep = Todo.create({id: 2, name: 'Sleep', done: false})
store.todos.push(work, sleep)
```

???
Let's say that through our UI and business login the store ends up creating 2 todos, Work and Sleep.

--
```javascript
{
    todos: [
        {name: 'Eat', done: false},
        {name: 'Work', done: true}
    ]
}

```

???
At any point, a new snapshot arrives from the server, saying that our todos should look like this.

The question is; what really happened?
Did Sleep changed to Eat or it got deleted and a new one got created?
---

```javascript
const store = AppStore.create()
assertTrue(work === store.todos[0])
```
???
Please notice that we cannot delete every old object and create a new one like you may do with immutable objects, because references needs to be preserved.
---

## React... but for data!

???

This problem was already well known by the React community and MST solved this problem the same way React does.

---

```javascript
const Todo = types.model({
    id: types.identifier(types.number),
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false)
})

```
???

When we define our Todo, we can define an identifier attribute to use when comparing items during reconciliation.

---
```javascript
const store = AppStore.create()
const work = Todo.create({id: 1, name: 'Work', done: true})
const sleep = Todo.create({id: 2, name: 'Sleep', done: false})
store.todos.push(work, sleep)
```
```javascript
{
    todos: [
        {id: 2, name: 'Eat', done: false},
        {id: 1, name: 'Work', done: true}
    ]
}
```
???
Thanks to this information, MST will now know that the two items shifted of place and the description of Sleep changed to Eat.

---

## React Lifecycle?

```javascript
const Todo = types
        .model("Todo", {
            title: ""
        })
        .actions(self => {
            function afterCreate() {
                console.log("new todo: " + self.title)
            }
            function beforeDestroy() {
                console.log("destroy todo: " + self.title)
            }
            function afterAttach() {
                console.log("attach todo: " + self.title)
            }
            function beforeDetach() {
                console.log("detach todo: " + self.title)
            }
            return {
                afterCreate,
                beforeDestroy,
                afterAttach,
                beforeDetach
            }
        })
```

---

## MobX-State-Tree Lifecycle

- constructor -> afterCreate
- componentDidMount -> afterAttach
- componentWillUnmount -> beforeDetach
- componentDidUnmount? -> beforeDestroy
---
<!-- 03_actions.md-->

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
---
<!-- 04_observability.md-->

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
---
<!-- 05_references.md-->

## State Tree?
???
It's common that in your application you have to deal with recursive data structures.

---
## How many times have you seen this?
```javascript
const Todo = connect(
    state => ({
        todo: state.todo,
        user: findUserById(state.todo.user_id)
    })
)(
    ({todo, user}) => <p>{todo.name} assigned to {user.name}</p>
)
```
???
How many times have you seen something like this?
---
## State Tree or Graph?
```javascript
{
    "users": {
        "1": {
            "id": "1",
            "name": "mweststrate"
        },
        "2": {
            "id": "2",
            "name": "mattiamanzati"
        }
    },
    "todos": {
        "1": {
            "name": "Eat a cake",
            "done": true,
            "user": "2"
        }
    }
}
```

???
We always speak about state tree, but is that correct?

---

## References
- allows to serialize value using the identifier attribute
- you can set/get the instance

---

## Defining a Reference

```javascript
const User = types.model({
  id: types.identifier(types.string),
  name: ""
});

const Todo = types
  .model({
    name: "",
    done: false,
    user: types.reference(User)
  })
```

---
```javascript
// ...
  .actions(self => {
    function setUser(user) {
        self.user = user;
    }

    return {setUser}
  })
```
```javascript
store.todos[0].setUser(store.users[0])
store.todos[0].user.name // => mwestrate
```
---
<!-- 06_mobx.md-->

## MobX Interop

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

Thanks to MobX, we also get for free reactions and autorun constructs, which allow us to automatically perform actions whenever a value changes.
---

## Observer HoC
```javascript
import {observer} from "mobx-react"

const AppView = observer(props =>
        <div>
            <button onClick={e => props.store.addTodo(randomId(), 'New Task')}>Add Task</button>
            {props.store.todos.values().map(todo => <TodoView todo={todo} />)}
            <TodoCounterView store={props.store} />
        </div>
)

```

???
Behind the scenes this means that you can use the mobx-react package to connect your store to your react components.

This is really nice because there is no need to apply memoization or SCU.
---
<!-- 07_redux.md-->

## And...Redux?

--
- Snapshot could be considered our redux state

--
- onSnapshot could be considered our store subscription

--
- applyAction could be considered our dispatch

--
- observer is our connect

---

## We can convert an MST instance into a redux store!

```javascript
import {asReduxStore} 
    from 'mobx-state-tree/middleware/redux'

const reduxStore = asReduxStore(store)
```

---


## We can convert an MST instance into a redux store!

```javascript
import {connectReduxDevtools} 
    from 'mobx-state-tree/middleware/redux'

connectReduxDevtools(store)
```

---
background-image: url(img/reduxdevtools.png)
---
<!-- 08_outro.md-->


---
background-image: url(img/builderx.png)
---
background-image: url(img/reactnativeseed.png)

---

## MobX-State-Tree

<img src="img/react.svg" width="50" /> It's React

<img src="img/git.png" width="50" /> It's Git

...but for data

`npm install mobx-state-tree`

---

## Thanks for your time!

@MattiaManzati