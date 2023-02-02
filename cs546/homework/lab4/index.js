const animals = require('./data/animals');
const dbcon = require('./data/connection');

// async function test_getall() {
//     console.log('testing getall');
//     console.log(await animals.getAll());
// }
//
// async function test_add() {
//     console.log('testing add');
//     const id = await animals.create('Henry', 'Snake');
//     console.log(id)
// }
//
// async function test_conn() {
//     console.log('testing db connection');
//     const db = await dbcon();
//     console.log(typeof(db));
// }
//
// async function test_remove() {
//     console.log('testing remove');
//     const id = await animals.remove("5d0baf03226cfd9a5b857a36");
// }
//
// async function test_rename() {
//     console.log('testing rename')
//     const result = await animals.rename("5d0baf471fca5d9a69d2acaf", "Spock")
//
// }

async function remove_all() {
    const all = await animals.getAll();
    for (const doc of all) {
        let id = doc['_id'].toString();
        animals.remove(id);
    }
}

async function main() {
    let sasha = await animals.create("Sasha", "Dog");
    console.log(sasha);
    let lucy = await animals.create("Lucy", "Dog");
    console.log(await animals.getAll());
    let duke = await animals.create("Duke", "Walrus");
    console.log(duke);
    let sashita = await animals.rename(sasha['_id'].toString(), 'Sashita');
    console.log(sashita);
    await animals.remove(lucy['_id'].toString());
    console.log(await animals.getAll());
}

remove_all().then(main());
