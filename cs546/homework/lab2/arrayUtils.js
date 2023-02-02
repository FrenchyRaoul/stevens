function check_array(array, check_length) {
    check_length = typeof check_length == 'undefined' ? true : check_length;
    if (array == null) {
        throw "error: array does not exist";
    }
    if (!(array.constructor===Array)) {
        throw "error: passed parameter is not array type";
    }
    if (check_length && (array.length === 0)) {
        throw "error: array is empty";
    }
}

function head(array) {
    check_array(array);
    return array[0];
}

function last(array) {
    check_array(array);
    return array[array.length - 1];
}

function remove(array, index) {
    check_array(array);
    if ((index < 0) || (index > array.length - 1)) {
        throw "error: index is out of range"
    }
    let left = array.slice(0, index);
    let right = array.slice(index+1, array.length);
    return left.concat(right);
}

function range(end, value) {
    if (end == null) {
        throw "error: end must be defined"
    }
    if (!(typeof end == 'number')){
        throw "error: end must be an integer"
    }
    if ((end < 0) || !(Number.isInteger(end))) {
        throw "error: end must be a positive integer";
    }
    let array = [];
    for (i = 0; i < end; i++) {
        if (value == null) {
            array[i] = i;
        }
        else {
            array[i] = value;
        }
    }
    return array;
}

function countElements(array) {
    check_array(array, false)
    let counts = Object();
    for (i = 0; i < array.length; i++) {
        let value = array[i];
        if (value in counts) {
            counts[value]++;
        }
        else {
            counts[value] = 1;
        }
    }
    return counts;
}

function isEqual(arrayOne, arrayTwo) {
    check_array(arrayOne, false);
    check_array(arrayTwo, false);
    if (arrayOne.length !== arrayTwo.length) {
        return false;
    }
    for (i = 0; i < arrayOne.length; i++) {
        if (arrayOne[i] !== arrayTwo[i]) {
            return false
        }
    }
    return true;
}

module.exports = {
    description: "This is various array utilities for lab 2",
    head: head,
    last: last,
    remove: remove,
    range: range,
    countElements: countElements,
    isEqual: isEqual
};
