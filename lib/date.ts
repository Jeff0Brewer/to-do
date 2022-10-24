const dateToString = (date: Date) => {
    return date.toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
    })
}

export {
    dateToString
}
