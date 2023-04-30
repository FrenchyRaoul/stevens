const redux = require('redux');
const characterReducer = require('./characterReducer');

const reducers = redux.combineReducers({
    character: characterReducer,
})

module.exports = reducers;