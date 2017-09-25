
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
