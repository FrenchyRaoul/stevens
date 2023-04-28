const characterReducer = (state = 0, action) => {
    switch (action.type) {
        case "FIRST_TYPE": {
            return state + "first"
        }
        case "SECOND_TYPE": {
            return [...state, action.value]
        }
        case "THIRD_TYPE": {
            return {...state, character: action.characterName}
        }
    }
    return state
}

module.exports = characterReducer;