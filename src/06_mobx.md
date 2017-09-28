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