const axios = require("axios");
const people_url = "https://gist.githubusercontent.com/robherley/5112d73f5c69a632ef3ae9b7b3073f78/raw/24a7e1453e65a26a8aa12cd0fb266ed9679816aa/people.json";
const weather_url = "https://gist.githubusercontent.com/robherley/1b950dc4fbe9d5209de4a0be7d503801/raw/eee79bf85970b8b2b80771a66182aa488f1d7f29/weather.json";
const work_url = "https://gist.githubusercontent.com/robherley/61d560338443ba2a01cde3ad0cac6492/raw/8ea1be9d6adebd4bfd6cf4cc6b02ad8c5b1ca751/work.json"

async function getPeopleData() {
    const { data } = await axios.get(people_url);
    return data
}

async function getWeatherData() {
    const { data } = await axios.get(weather_url);
    return data
}

async function getWorkData() {
    const { data } = await axios.get(work_url);
    return data
}

async function getPersonById(index) {
    if ((index < 1) || !(Number.isInteger(index))) {
        throw "index must be a positive integer"
    }
    const data = await getPeopleData();
    const map = new Map(data.map(record=>[record.id, record]));
    const record = map.get(index);
    if (record == null) { // we could check the length of the object, but this method handles missing ids
        throw "this index does not exist in the dataset"
    }
    return record['firstName'] + " " + record['lastName'];
}

async function lexIndex(index) {
    if ((index < 1) || !(Number.isInteger(index))) {
        throw "index must be a positive integer"
    }
    const data = await getPeopleData();
    const sorted = data.sort((a, b) => ((a['firstName']+a['lastName']) > (b['firstName']+b['lastName'])) ? 1 : -1);
    if (index >= data.length) {
        throw "index is out of range. max index is " + data.length.toString();
    }
    const record = sorted[index];
    return record['firstName'] + " " + record['lastName'];
}

function countVowels(input) {
    const strary = input.split('');
    const filtered = strary.filter(letter => ['a', 'e', 'i', 'o', 'u'].includes(letter));
    return filtered.length
}

function countConsonants(input) {
    const strary = input.split('');
    const filtered = strary.filter(letter => !(['a', 'e', 'i', 'o', 'u'].includes(letter)) && letter.match(/[a-z]/i));
    return filtered.length
}

async function firstNameMetrics() {
    const data = await getPeopleData();
    const totalLetters = data.reduce((accumulator, currentValue) => accumulator + currentValue['firstName'].length, 0);
    const totalVowels = data.reduce((accumulator, currentValue) => accumulator + countVowels(currentValue['firstName']), 0);
    const totalConsonants = data.reduce((accumulator, currentValue) => accumulator + countConsonants(currentValue['firstName']), 0);
    const longestName = data.reduce((accumulator, currentValue) =>
        currentValue['firstName'].length > accumulator['firstName'].length ? currentValue : accumulator)['firstName'];
    const shortestName = data.reduce((accumulator, currentValue) =>
        currentValue['firstName'].length < accumulator['firstName'].length ? currentValue : accumulator)['firstName'];
    return {
        totalLetters: totalLetters,
        totalVowels: totalVowels,
        totalConsonants: totalConsonants,
        longestName: longestName,
        shortestName: shortestName
    };
}

async function getRecordByName(firstname, lastname) {
    if ((firstname == null) || lastname == null) {
        throw "both first and last name must be defined"
    }
    if ((typeof(firstname) != 'string') || (typeof(lastname) != 'string')) {
        throw "both first and last names must be strings"
    }
    const ppldata = await getPeopleData();
    const filtered = ppldata.filter(record => (record['firstName'] === firstname) && (record['lastName'] === lastname));
    if (filtered.length === 0) {
        throw "could not find a matching record"
    }
    if (filtered.length > 1) {
        throw "duplicate names found, don't know how to proceed..."
    }
    return filtered[0]
}

async function shouldTheyGoOutside(firstname, lastname) {
    const wthdata = await getWeatherData();
    const record = await getRecordByName(firstname, lastname);
    const zip = record['zip'];
    const map = new Map(wthdata.map(record=>[record['zip'], record['temp']]));
    const temp = map.get(zip);
    return (temp >= 34) ? "Yes, " + firstname + " should go outside." : "No, " + firstname + " should not go outside."
}

async function whereDoTheyWork(firstname, lastname) {
    const wrkdata = await getWorkData();
    const record = await getRecordByName(firstname, lastname);
    const ssn = record['ssn'];
    const map = new Map(wrkdata.map(record=>[record['ssn'], record]));
    const work_record = map.get(ssn);
    return `${firstname} ${lastname} - ${work_record['jobTitle']} at ${work_record['company']}. They will ${(work_record['willBeFired']) ? "" : "not "}be fired.`;
}

async function validateIP(ipaddr) {
    if ((ipaddr == null) || (typeof(ipaddr) != 'string')) {
        return false
    }
    const split = ipaddr.split('.');
    if (!(split.length === 4)) {
        return false
    }
    for (const num of split) {
        let val = Number(num);
        if ((val > 255) || (val < 0) || num === '') {
            return false
        }
    }
    return true
}

async function findTheHacker(ip) {
    const valid = await validateIP(ip);
    if (!valid) {
        throw "this is an invalid ip address"
    }
    const wrkdata = await getWorkData();
    const ppldata = await getPeopleData();
    const ip2ssn = new Map(wrkdata.map(record=>[record['ip'], record['ssn']]));
    const ssn2person = new Map(ppldata.map(record=>[record['ssn'], `${record['firstName']} ${record['lastName']}`]));
    const ssn = ip2ssn.get(ip);
    if (ssn == null) {
        throw "no one has this ip!"
    }
    const person = ssn2person.get(ssn);
    if (person == null) {
        throw "no one has an ssn associated with this ip!"
    }
    return `${person} is the hacker!`
}

module.exports = {
    getPersonById: getPersonById,
    lexIndex: lexIndex,
    firstNameMetrics: firstNameMetrics,
    getRecordByName: getRecordByName,
    shouldTheyGoOutside: shouldTheyGoOutside,
    whereDoTheyWork: whereDoTheyWork,
    findTheHacker: findTheHacker
};
