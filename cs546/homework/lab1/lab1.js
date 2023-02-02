const questionOne = function questionOne(arr) {
    return arr.reduce((current_total, array_value) => {
        return current_total + array_value * array_value;
    }, 0);
    // Implement question 1 here
};

const questionTwo = function questionTwo(num) {
    function fibb(number) {
        if (number < 1) {
            return 0;
        }
        if (number === 1) {
            return 1;
        }
        return fibb(number-1) + fibb(number-2);
    }
    return fibb(num)
    // Implement question 2 here
};

const questionThree = function questionThree(text) {
    // Implement question 3 here
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    let vowel_arr = text.split('').filter(letter => vowels.includes(letter.toLowerCase()));
    return vowel_arr.length;
};

const questionFour = function questionFour(num) {
    function factorial(number) {
        if (number < 0) {
            return undefined;
        }
        if (number < 2) {
            return 1;
        }
        return number * factorial(number-1);
    }
    return factorial(num);
};

module.exports = {
    firstName: "Nicholai",
    lastName: "L'Esperance",
    studentId: "10443833",
    questionOne,
    questionTwo,
    questionThree,
    questionFour
};
