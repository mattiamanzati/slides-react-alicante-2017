
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
