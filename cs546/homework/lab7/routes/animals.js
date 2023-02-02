const animals = require('../data/animals');
const posts = require('../data/posts');
const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;

async function getFormattedAnimalData(animal) {
    return await getPostTitles(await getLikeTitles(animal));
}

// translate list of like ids to list of objects with id name and value
async function getLikeTitles(animal) {
    const likes = [];
    for (const post_id of animal.likes) {
        const post = await posts.get(post_id);
        likes.push({
            _id: post._id,
            title: post.title
        })
    }
    animal.likes = likes;
    return animal
}

// translate list of post ids to list of objects with id name and value
async function getPostTitles(animal) {
    const postlist = [];
    const animal_posts = await posts.getPostsByUserid(animal._id);
    for (const post of animal_posts) {
        postlist.push({
            _id: post._id,
            title: post.title,
        })
    }
    animal.posts = postlist;
    return animal
}

async function getAnimals() {
    const outdata = [];
    const allAnimals = await animals.getAll();
    for (const animal of allAnimals) {
        outdata.push(await getFormattedAnimalData(animal))
    }
    return outdata
}

async function postAnimal(animal) {
    if (!animal.name) throw "JSON request missing 'name'";
    if (!animal.animalType) throw "JSON request missing 'animalType'";
    await animals.create(animal.name, animal.animalType)
}

router.get('/', async (req, res) => {
    return res.send(await getAnimals());
});

router.post('/', async (req, res) => {
    try {
        await postAnimal(req.body);
        res.sendStatus(200);
    }
    catch(error) {
        console.error(error);
        res.sendStatus(400);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id_obj = ObjectId(req.params.id);
        try {
            const animal = await animals.get(id_obj);
            res.send(await getFormattedAnimalData(animal));
        }
        catch(error) {
            res.sendStatus(404);
        }
    }
    catch(error) {
        console.error(error);
        res.sendStatus(400);
    }
});

router.put('/:id', async (req, res) => {
    let id = null;
    try {
        id = ObjectId(req.params.id);
        try {
            await animals.get(id)
        }
        catch(error) {
            console.error(error);
            res.send(404);
            return
        }
        await animals.updateAnimal(id, req.body.newName, req.body.newType);
        res.sendStatus(200)
    }
    catch(error) {
        console.error(error);
        res.sendStatus(400);
    }
});

router.delete('/:id', async (req, res) => {
    let id = null;
    try {
        id = ObjectId(req.params.id);
    }
    catch(error) {
        console.error(error);
        res.sendStatus(400);
    }
    let postings = null;
    try {
        postings = await posts.getPostsByUserid(id);
        const result = await animals.remove(id);
        result.data = await getFormattedAnimalData(result.data);
        res.send(result);
    }
    catch(error) {
        console.error(error);
        res.sendStatus(404)
    }

    const all_animals = await animals.getAll();
    for (const post of postings) {
        for (const animal of all_animals) {
            await animals.deleteLike(animal._id, post._id)
        }
        await posts.remove(post._id)
    }
});

module.exports = router;
