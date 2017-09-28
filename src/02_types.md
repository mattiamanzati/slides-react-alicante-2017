
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