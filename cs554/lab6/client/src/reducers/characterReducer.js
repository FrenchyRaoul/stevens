const initialState = {
    collectors: {},
    currentCollector: {name: "My Collector", characters: []}
};

const characterReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_CHARACTER": {
            const currentCollector = state['currentCollector']
            if (currentCollector['characters'].includes(action.characterId)) {
                return state
            }
            currentCollector['characters'].push(action.characterId)
            return {...state, currentCollector: currentCollector}
        }
        case "REMOVE_CHARACTER": {
            return state
        }
    }
    switch (action.type) {
        case "SET_COLLECTOR": {
            const previous = state['currentCollector']
            state['collectors'][previous.name] = previous['characters']
            state['currentCollector'] = {
                name: action.collector,
                characters: (action.collector in state.collectors) ? state['collectors'][action.collector]  : []
            }
            return state
        }
    }
    return state
}

module.exports = characterReducer;