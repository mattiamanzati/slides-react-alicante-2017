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