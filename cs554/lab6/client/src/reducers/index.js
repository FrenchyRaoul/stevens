const redux = require('redux');
const characterReducer = require('./character');

const reducers = redux.combineReducers({
    character: characterReducer,
})

module.exports = reducers;