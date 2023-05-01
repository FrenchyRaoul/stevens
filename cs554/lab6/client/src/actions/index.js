const collectCharacter = (characterId) => {
    return {
        type: "ADD_CHARACTER",
        characterId: characterId
    }
}

const removeCharacter = (characterId) =>({
    type: "REMOVE_CHARACTER",
    characterId: characterId
})

const createCollector = (collector) => ({
    type: "CREATE_COLLECTOR",
    collector: collector

})

const setCollector = (collector) => ({
    type: "SET_COLLECTOR",
    collector: collector
})

const deleteCollector = (collector) => ({
    type: "DELETE_COLLECTOR",
    collector: collector
})


module.exports = {
    collectCharacter,
    removeCharacter,
    setCollector,
    createCollector,
    deleteCollector,
}