function check_string(string) {
    if (string == null) {
        throw "error: string is undefined";
    }
    if (typeof string != 'string') {
        throw "error: argument is not of string type";
    }
}

function capitalize(string) {
    check_string(string);
    const left = string[0];
    const right = string.substring(1);
    return left.toUpperCase() + right.toLowerCase();
}

function repeat(string, num) {
    check_string(string);
    if ((typeof num !== 'number') || (num < 1) || !Number.isInteger(num)) {
        throw "error: num must be a positive integer"
    }
    let output = "";
    for (i = 0; i < num; i++) {
        output = output + string;
    }
    return output;
}

function countChars(string) {
    check_string(string)
    let counts = Object();
    for (i = 0; i < string.length; i++) {
        let value = string[i];
        if (value in counts) {
            counts[value]++;
        }
        else {
            counts[value] = 1;
        }
    }
    return counts;
}

module.exports = {
    capitalize: capitalize,
    repeat: repeat,
    countChars: countChars
};