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