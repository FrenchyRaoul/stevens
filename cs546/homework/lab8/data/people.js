const axios = require('axios');

async function getPeople() {
    const { data } = await axios.get('https://gist.githubusercontent.com/robherley/5112d73f5c69a632ef3ae9b7b3073f78/raw/24a7e1453e65a26a8aa12cd0fb266ed9679816aa/people.json');
    return data // this will be the array of people
}


async function searchPeople(search) {
    const people = await getPeople();
    let results = [];
    const searchLower = search.toLowerCase();
    for (const person of people) {
        const lowerFirst = person.firstName.toLowerCase();
        const lowerLast = person.lastName.toLowerCase();
        if (lowerFirst.includes(searchLower) || lowerLast.includes(searchLower)) {
            results.push(person)
        }
    }
    return results.slice(0, 20);
}

async function getPerson(id) {
    const people = await getPeople();
    const int_id = parseInt(id);
    for (const person of people) {
        if (int_id === person.id) {
            return person
        }
    }
    throw "could not find person"
}

module.exports = {
    searchPeople: searchPeople,
    getPerson: getPerson
};