type TouchPos = {
    start: {
        x: number,
        y: number
    },
    end: {
        x: number,
        y: number
    }
}

const touchPos: TouchPos = {
    start: {
        x: 0,
        y: 0
    },
    end: {
        x: 0,
        y: 0
    }
}

const swipeMoveHandler = (e: TouchEvent) => {
    if (e.touches.length > 1) { return }
    touchPos.end.x = e.touches[0].clientX
    touchPos.end.y = e.touches[0].clientY
}

const swipeStartHandler = (e: TouchEvent) => {
    window.addEventListener('touchmove', swipeMoveHandler)
    if (e.touches.length > 1) { return }
    touchPos.start.x = e.touches[0].clientX
    touchPos.start.y = e.touches[0].clientY
    touchPos.end.x = e.touches[0].clientX
    touchPos.end.y = e.touches[0].clientY
}

const swipeEndHandler = (e: TouchEvent, leftSwipe: () => void, rightSwipe: () => void) => {
    window.removeEventListener('touchmove', swipeMoveHandler)
    if (e.touches.length > 1) { return }
    const dx = touchPos.end.x - touchPos.start.x
    const dy = touchPos.end.y - touchPos.start.y
    if (Math.abs(dy) > Math.abs(dx)) { return }
    const swipeDist = 20
    if (dx > swipeDist) {
        rightSwipe()
    } else if (Math.abs(dx) > swipeDist) {
        leftSwipe()
    }
}

export {
    swipeStartHandler,
    swipeEndHandler
}
