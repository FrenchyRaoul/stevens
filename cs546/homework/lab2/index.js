const arrutils = require('./arrayUtils.js');
const strutils = require('./stringUtils.js');
const objutils = require('./objUtils.js');

// isEqual -----------------------------------------
try {
    // should fail
    arrutils.isEqual([1,2,3,4], 1234);
    console.error('isEqual did not error')
} catch {
    console.log('isEqual errored successfully')
}

try {
    // should pass
    arrutils.isEqual([1,2,3,4], [2,3,4]);
    console.log('isEqual passed successfully')
} catch {
    console.error('isEqual failed test case')
}

// repeat ------------------------------------------
try {
    // should fail
    strutils.repeat('abc', 0);
    console.error('repeat did not error');
} catch {
    console.log('repeat errored successfully')
}

try {
    // should pass
    strutils.repeat('abc', 5);
    console.log('repeat passed successfully');
} catch {
    console.error('repeat failed test case')
}

// countChars --------------------------------------
try {
    // should fail
    strutils.countChars(5544);
    console.error('countChars did not error');
} catch {
    console.log('countChars errored successfully');
}

try {
    // should pass
    strutils.countChars('5544');
    console.log('countChars passed successfully');
} catch {
    console.log('countChars failed test case');
}

// smush -------------------------------------------
try {
    // should fail
    objutils.smush({1: 55})
    console.error('smush did not error');
} catch {
    console.log('smush errored successfully')
}

try {
    //should pass
    objutils.smush({1: 55}, {'a': 30});
    console.log('smush passed successfully');
} catch {
    console.error('smush failed test case')
}

