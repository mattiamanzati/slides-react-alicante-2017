
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

???

Which one to Pick? 
Those libraries are based on opposite concepts, with their pros and cons...

---

`redux && mobx`
.appear[
    ## mobx-state-tree
]

???

Would'nt be awesome to get the best of both world?

---

`redux || mobx`

.appear[
    `true`
]

???

There is often a heated debate. I am no neutral party in the discussion, but lets recap the two strategies in general. And I oversimplify and generalize to do that

---

MobX vs Redux: Comparing the Opposing Paradigm

.appear[
        <i class="em em-arrow_double_down"></i>

MobX vs Redux: *Combining* the Opposing Paradigm
]

???

Can we have all the cool things of Redux, without it's learning curve?

You might now all have digested that. TIme to confuse you with something new

---

<img src="img/logo.png" style="height:150px"/>

## mobx-state-tree

*A living, opinionated, state tree*

---

<img src="img/logo.png" style="height:150px"/>

## mobx-state-tree

The best ideas<i class="em em-bulb"></i>
<br/>+<br/>
The best practices<i class="em em-construction_worker"></i>
<br/>=<br/>
The best productivity<i class="em em-running"></i>

---

# Mutable Model Graphs

<br/>
<br/>

![graph1](img/graph1.png)

---

# Mutable Model Graphs

<br/>
<br/>

![graph2](img/graph2.png)

---

# Mutable Model Graphs

<br/>
<br/>

![graph3](img/graph3.png)

---

# Immutable Data Trees

<br/>
<br/>

![redux](img/redux1.png)

???

Two years ago, Redux was introduced on this very same conference. And it has set a new level on what we want in terms of DX and predictability.

---

# Immutable Data Trees

<br/>
<br/>

![redux](img/redux2.png)

---

# Immutable Data Trees

<br/>
<br/>

![redux](img/redux3.png)

---

class: ticks2

<p style="position:relative;left: 106px;font-style:italic;">
    <span style="font-size: 0.6em">Immutable Trees &nbsp;&nbsp;&nbsp; Model Graphs<span>
</p>

.tick1[cheap snapshots<i class="em em-white_check_mark"></i>]
.tick2[fine grained updates<i class="em em-white_check_mark"></i>]
.tick1[tree structure<i class="em em-white_check_mark"></i>]
.tick2[graph structure<i class="em em-white_check_mark"></i>]
.tick1[easy hydration<i class="em em-white_check_mark"></i>]
.tick2[co-location of actions<i class="em em-white_check_mark"></i>]
.tick1[protection of data<i class="em em-white_check_mark"></i>]
.tick1[replayable actions<i class="em em-white_check_mark"></i>]
.tick2[straight forward actions<i class="em em-white_check_mark"></i>]
.tick1[devtool support<i class="em em-white_check_mark"></i>]
.tick2[static analysis / typing<i class="em em-white_check_mark"></i>]
.tick1[ref-by-state<i class="em em-white_check_mark"></i>]
.tick2[ref-by-identity<i class="em em-white_check_mark"></i>]

???

Why a tree Trees can be traversed in predicatable, finite order


---

## Snapshots Are Awesome<i class="em em-camera"></i>

.appear[What if I could get them for free after each mutation?]

???

Snapshots are awesome; like taxes are awesome. I like the idea because all the benefits it yields. I just don't like to pay

So what if..

.. structural sharing is mandatory

---

class: boxedimg

![img](img/tree_store.png)

---

Demo

---

```javascript
class Book {
    @observable title: string
    @observable price: number

    @computed get snapshot() {
        return {
            title: this.title,
            price: this.number
        }
    }
}
```

---

```javascript
class Store {
    @observable books: Book[] = []

    @computed get snapshot() {
        return {
            todos: this.books.map(book => book.snapshot)
        }
    }
}
```

---

class: boxedimg

![img](img/todo1.png)

---

class: boxedimg

![img](img/todo2.png)

---

class: boxedimg

![img](img/todo3.png)

---

class: boxedimg

![img](img/seeds.png)

---

<img src="img/seed1.png" width="350px"/>
<img src="img/seed2.png" width="350px"/>

* How to get back from a seed to a full tree? <i class="em em-deciduous_tree"></i>
* `get snapshot` boilerplate <i class="em em-confused"></i>

---

Demo

---


```javascript
import { onSnapshot, applySnapshot } from "mobx-state-tree"

const history = []

onSnapshot(store, snapshot => {
    history.push(snapshot)
})

replay(index) {
    applySnapshot(store, history[index])
}
```

---

## Type Information!<i class="em em-dizzy"></i>

.appear[Compile time type checks]

.appear[Run time type checks]

.appear[Behavior]

---

class: boxedimg

![img](img/mst3.png)

---

# Composing Types

```javascript
import {types, getSnapshot} from "mobx-state-tree"

const Type = types.model(properties, actions)
```

.appear[
```javascript
const instance = Type.create(snapshot)
instance.someAction()
```
]

.appear[
```javascript
const snapshot = getSnapshot(instance)
```
]

---

# Composing Types

```javascript
const Book = types.model({
    title: types.string,
    price: types.number
}, {
    setPrice(newPrice) {
        this.price = newPrice
    }
})
```

.appear[
```javascript
const Store = types.model({
    books: types.array(Book)
})
```
]

---

# Composing Types

```javascript
const store = Store.create({
    books: [{
        title:
            "The Hidden Life of Trees: What They Feel, How They Communicate",
        price: 24.95
    }]
})

```

.appear[
```javascript
store.books[0].setPrice(13.57)
```
]

---

# Composing Types

```javascript
store.books.push(Book.create({ title: "A Tree Grows in Brooklyn" }))
```

.appear[
```javascript
store.books.push({ title: "A Tree Grows in Brooklyn" })
```
]

.appear[
```javascript
store.books[0].setPrice(13.57)
```
]

???

When modifying the tree at any point, type is infered from the typesystem and applied

---

# Run Time Type Checking

```javascript
const store = Store.create({
    books: [{
        price: "24.95"
    }]
})
```

.appear[
```
Error while converting `{"books":[{"price":"24.95"}]}` to `Store`:
 at path "/books/0/title" value `undefined` is not assignable to type: `string`.
 at path "/books/0/price" value `"24.95"` is not assignable to type: `number`.
```
]

---

# Design Time Type Checking

<br/>
<br/>

.appear[
![img](img/tserror2.png)
]

---

# Type Checking

TComb inspired

collections, refinements, unions, literals, recursive types

<img src="img/gcanti.png" height="200px" style="border-radius:10px; margin-right: 20px;"/>
<img src="img/mattia.jpg" height="200px" style="border-radius:10px"/>

???

Mattia Manzati https://twitter.com/@mattiamanzati) and
Giulio Canti https://twitter.com/GiulioCanti),

---

class: ticks3

<p style="position:relative;left: 106px;font-style:italic;">
    <span style="font-size: 0.6em">Immutable Trees &nbsp;&nbsp;&nbsp; Model Graphs&nbsp;&nbsp;&nbsp; Mobx-State-Tree<span>
</p>

.tick1[cheap snapshots<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick2.faded[fine grained updates<i class="em em-white_check_mark"></i>]
.tick1[tree structure<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick2.faded[graph structure<i class="em em-white_check_mark"></i>]
.tick1[easy hydration<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick2[co-location of actions<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick1.faded[protection of data<i class="em em-white_check_mark"></i>]
.tick1.faded[replayable actions<i class="em em-white_check_mark"></i>]
.tick2[straight forward actions<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick1.faded[devtool support<i class="em em-white_check_mark"></i>]
.tick2[static analysis / typing<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick1.faded[ref-by-state<i class="em em-white_check_mark"></i>]
.tick2.faded[ref-by-identity<i class="em em-white_check_mark"></i>]

---

Patches Demo

???

MobX powered

Patches

---

# Actions

```javascript
const Book = types.model({
    title: types.string,
    price: types.number
}, {
    setPrice(newPrice) {
        this.price = newPrice
    }
})
```

---

# Actions

* Instances can only be modified through actions
* Actions can only modify own subtree

---

# Actions

```javascript
store.books[0].title = "I hate trees!"
```

.appear[
```
Error: Cannot modify 'Book@/books/0',
the object is protected and can only be modified by using an action.
```
]

---

Demo

---

# Actions

* Replayable
* Method invocation _produces_ action description
* Middleware support

---

## Use Case: Modify Complex Data In Wizard

???

Use case syncing actions over websockets with other clients

---

```javascript
import { clone, recordActions } from "mobx-state-tree"

const bookCopy = clone(store.books[0])
```

.appear[
```javascript
function clone(tree) {
    return getType(tree).create(getSnapshot(tree))
}
```
]

---

```javascript
import { clone, recordActions } from "mobx-state-tree"

const bookCopy = clone(store)
const recorder = recordActions(bookCopy)
```

.appear[
```javascript
...user modifies the book in a wizard
And upon commit...
```
]

.appear[
```javascript
recorder.replay(store.books[0])
```
]

---

class: ticks3

<p style="position:relative;left: 106px;font-style:italic;">
    <span style="font-size: 0.6em">Immutable Trees &nbsp;&nbsp;&nbsp; Model Graphs&nbsp;&nbsp;&nbsp; Mobx-State-Tree<span>
</p>

.tick1.faded[cheap snapshots<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2[fine grained updates<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick1.faded[tree structure<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2.faded[graph structure<i class="em em-white_check_mark"></i>]
.tick1.faded[easy hydration<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2.faded[co-location of actions<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1[protection of data<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick1[replayable actions<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick2.faded[straight forward actions<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1.faded[devtool support<i class="em em-white_check_mark"></i>]
.tick2.faded[static analysis / typing<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1.faded[ref-by-state<i class="em em-white_check_mark"></i>]
.tick2.faded[ref-by-identity<i class="em em-white_check_mark"></i>]

---

class: fullscreen

![img](img/elrond.jpg)

???

"Death is gift to men" (Elrond in a LOTR movie)

---

# References

```javascript
function printPrice(book: Book) {
    setTimeout(
        () => console.log(book.price),
        1000
    )
}

printPrice(store.books.get("ISBN-123"))
```

???

what does `book` parameter refer to?
* the state of the passed book at a specific point in time?
* the concept of the passed book, regardless what state it is in currently

---

class: boxedimg

![img](img/seasons.jpg)

???

Refer to the state of the tree at present, or just the concept

---

class: boxedimg

![img](img/refs.png)

---

# References

```javascript
function printPrice(book: Book) {
    setTimeout(
        () => console.log(book.price),
        1000
    )
}

printPrice(store.books.get("ISBN-123"))
```

|  Immutable Trees | Mutable Model Graphs |
| --- | ---- | --- |
| .appear[`price` won't have changed] | .appear[`price` might have changed] |
| .appear[`price` might be stale] | .appear[`price` will not be stale] |

???

artifical example. but what if it is no log, but a debounced function to send todo to backend?

---

# References

```javascript
function printPrice(book: Book) {
    setTimeout(
        () => console.log(book.price),
        1000
    )
}
```

```javascript
printPrice(store.books.get("ISBN-123"))
```

```javascript
printPrice(getSnapshot(store.books.get("ISBN-123")))
```

---

# References

```
printPrice(store.books.get("ISBN-123"))
store.removeBook("ISBN-123")

// what will be printed?
```

.appear[
```
Error: This object has died and is no longer part
of a state tree. It cannot be used anymore.
```
]

???

Defends against those kind of bugs, where while debugging, you actually are looking at the wrong object without realizing for a while.

Immutability defends against accidental modifications

Defends against accidental stale reads

---

class: fullscreenw

![img](img/swing.jpg)

---

## mobx-state-tree

Protection against uncoordinated modifications

Protection against stale reads

---

class: fullscreenw

![tree](img/eden2.jpg)

---

# Graphs

```
bookStore
   - books
       - book A
       - book B
   - cart
       - entry 1
           - book A ?
           - quantity
       - entry 2
           - book B ?
           - quantity
```

---

# Graphs

<br/>

```javascript
const CartEntry = types.model({
    amount: types.number,
    book: types.reference(Book)
})

cartEntry.book = bookStore.books[0]

console.log(bookEntry.book.title) // OK

console.dir(getSnapshot(bookEntry))
```

.appear[
```javascript
{
    amount: 3,
    book: "24"
}
```
]

---

class: ticks3

.tick1.faded[cheap snapshots<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2.faded[fine grained updates<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1.faded[tree structure<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2[graph structure<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick1.faded[easy hydration<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2.faded[co-location of actions<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1.faded[protection of data<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1.faded[replayable actions<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2.faded[straight forward actions<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1[devtool support<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick2.faded[static analysis / typing<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1[ref-by-state<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]
.tick2[ref-by-identity<i class="em em-white_check_mark"></i>.appear[<i class="em em-palm_tree"></i>]]

---

class: ticks3

.tick1[cheap snapshots<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2[fine grained updates<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1[tree structure<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2[graph structure<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1[easy hydration<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2[co-location of actions<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1[protection of data<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1[replayable actions<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2[straight forward actions<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1[devtool support<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2[static analysis / typing<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick1[ref-by-state<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]
.tick2[ref-by-identity<i class="em em-white_check_mark"></i><i class="em em-palm_tree"></i>]

---

Demo

---

```javascript
import { types } from 'mobx-state-tree'

const Todo = types.model({
    text: 'Learn Redux',
    completed: false,
    id: 0
})

const TodoStore = types.model({
    todos: types.array(Todo),

    findTodoById: function (id) {
      return this.todos.find(todo => todo.id === id)
    }
}, {
    DELETE_TODO({id}) {
      this.todos.remove(this.findTodoById(id))
    }
    // .. and more
})
```

???

why the weird function name?
why 'learn redux'?

Actually, if you check out the sources, you will notice the original reducer unit tests are still in there

---

<img src="img/logo.png" style="height:150px"/>

## MST: Combining The Opposing Paradigms

The best ideas<i class="em em-bulb"></i>
<br/>+<br/>
The best practices<i class="em em-construction_worker"></i>
<br/>=<br/>
The best productivity<i class="em em-running"></i>

???

When is it available?

Star!

Is it completely ready?

No.

But, worse is better.

Let's publish!

TODO Visit booth prizes thingy

---

<div style="position: absolute;
    z-index: 1000;
    top: 150px;
    background: white;
    width: 106%;
    margin-left: -4em;
    padding: 20px;">
    <i class="em em-star"></i>https://github.com/mobxjs/mobx-state-tree<i class="em em-star"></i>
</div>

.background[
![img](img/tree-hug.jpg)
]

