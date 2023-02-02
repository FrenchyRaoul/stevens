function check_object(arg) {
    return ((arg != null) && (typeof arg == 'object'))
}

function extend(...args){
    if (args.length < 2) {
        throw "error: at least two objects must be passed to extend"
    }
    if (!(args.every(check_object))) {
        throw "error: at least one argument is undefined or not an object."
    }
    let merged = Object();
    for (i = args.length-1; i>=0; i--) {
        //console.log(args[i]);
        merged = {...merged, ...args[i]}
    }
    return merged;
}

function smush(...args){
    if (args.length < 2) {
        throw "error: at least two objects must be passed to extend"
    }
    if (!(args.every(check_object))) {
        throw "error: at least one argument is undefined or not an object."
    }
    let merged = Object();
    for (i = 0; i<args.length; i++) {
        //console.log(args[i]);
        merged = {...merged, ...args[i]}
    }
    return merged;
}

function mapValues(object, func) {
    check_object(object);
    if (!(typeof func == 'function')) {
        throw 'error: func parameter must be function type';
    }
    let newobj = Object();
    for (var key of Object.keys(object)) {
        newobj[key] = func(object[key]);
    }
    return newobj;
}

module.exports = {
    extend: extend,
    smush: smush,
    mapValues: mapValues
};