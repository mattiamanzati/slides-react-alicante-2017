var slideshow = remark.create({
    ratio: '4:3',
    highlightLanguage: 'javascript',
    highlightStyle: 'monokai'
});

function addClass(node, clazz) {
    node.className = node.className + " " + clazz
    return node
}

function removeClass(node, clazz) {
    node.className = Array.prototype.filter.call(node.classList, c => c !== clazz)
    return node
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    console.log(event.key)
    switch (keyName) {
        case "v":
            break
        case "PageUp":
        case "ArrowLeft":
            event.stopPropagation();
            const prev = document.querySelectorAll(".remark-visible .appeared")
            if (prev.length)
                addClass(removeClass(prev[prev.length - 1], "appeared"), "appear")
            else {
                slideshow.gotoPreviousSlide()
                Array.prototype.map.call(
                    document.querySelectorAll(".remark-visible .appear"),
                    elem => addClass(removeClass(elem, "appear"), "appeared")
                )
            }
            break
        case "PageDown":
        case "ArrowRight":
            event.stopPropagation();
            const next = document.querySelector(".remark-visible .appear")
            if (next)
                addClass(removeClass(next, "appear"), "appeared")
            else {
                slideshow.gotoNextSlide()
                Array.prototype.map.call(
                    document.querySelectorAll(".remark-visible .appeared"),
                    elem => addClass(removeClass(elem, "appeared"), "appear")
                )
            }
            break
    }
}, false);

