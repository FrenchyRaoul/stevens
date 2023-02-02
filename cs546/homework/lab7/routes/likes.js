const animals = require('../data/animals');
const posts = require('../data/posts');
const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;

router.post('/:animalId', async (req, res) => {

    try {
        const animal_id = ObjectId(req.params.animalId);
        const post_id = ObjectId(req.query.postId);

        let animal = null;
        try {
            animal = await animals.get(animal_id);
            await posts.get(post_id)
        }
        catch(error) {
            console.error(error);
            res.sendStatus(404);
        }
        await animals.addLike(animal_id, post_id);
        res.sendStatus(200);
    }
    catch(error) {
        console.error(error);
        res.sendStatus(400)
    }

});

router.delete('/:animalId', async (req, res) => {

    try {
        const animal_id = ObjectId(req.params.animalId);
        const post_id = ObjectId(req.query.postId);

        try {
            await animals.get(animal_id);
            await posts.get(post_id)
        }
        catch(error) {
            console.error(error);
            res.sendStatus(404);
        }
        await animals.deleteLike(animal_id, post_id);
        res.sendStatus(200);
    }
    catch(error) {
        console.error(error);
        res.sendStatus(400)
    }

});

module.exports = router;
