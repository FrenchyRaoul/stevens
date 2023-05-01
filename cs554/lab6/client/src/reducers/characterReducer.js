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
            const currentCollector = state['currentCollector']
            if (!currentCollector['characters'].includes(action.characterId)) {
                return state
            }
            state.currentCollector['characters'] = currentCollector['characters'].filter((id) => id !== action.characterId)
            return state
        }
        case "SET_COLLECTOR": {
            const previous = state['currentCollector']
            state['collectors'][previous.name] = previous['characters']
            state['currentCollector'] = {
                name: action.collector,
                characters: (action.collector in state.collectors) ? state['collectors'][action.collector]  : []
            }
            return state
        }
        case "CREATE_COLLECTOR": {
            if (!Object.keys(state.collectors).includes(action.collector)) {
                state.collectors[action.collector] = []
            }
            return state
        }
        case "DELETE_COLLECTOR": {
            delete state.collectors[action.collector]
            if (state.currentCollector.name === action.collector) {
                if (Object.keys(state.collectors).length === 0) {
                    return {
                        collectors: {},
                        currentCollector: {name: "My Collector", characters: []}
                    }
                }
                const nextName = Object.keys(state.collectors)[0]
                state.currentCollector = {
                    name: nextName,
                    characters: state.collectors[nextName]
                }
                return state
            }
            return state
        }
        default:
            return state
    }
}

module.exports = characterReducer;