const collectCharacter = (characterId) => {
    return {
        type: "ADD_CHARACTER",
        characterId: characterId
    }
}

const removeCharacter = (collector, characterId) =>({
    type: "REMOVE_CHARACTER",
    collector: collector,
    characterId: characterId
})

const setCollector = (collector) => ({
    type: "SET_COLLECTOR",
    collector: collector
})

module.exports = {
    collectCharacter,
    removeCharacter,
    setCollector
}