const posts = require('../data/posts');
const animals = require('../data/animals');
const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;

async function getFormattedPostData(post) {
    const author_id = post.author;
    const animal = await animals.get(author_id);
    post.author = {
        _id: animal._id,
        name: animal.name
    };
    return post;
}

async function getPosts() {
    const outdata = [];
    const allPosts = await posts.getAll();
    for (const post of allPosts) {
        outdata.push(await getFormattedPostData(post))
    }
    return outdata
}

router.get('/', async (req, res) => {
    res.send(await getPosts());
});

router.get('/:id', async (req, res) => {
    try {
        const id_obj = ObjectId(req.params.id);
        const post = await posts.get(id_obj);
        res.send(await getFormattedPostData(post));
    }
    catch(error) {
        console.error(error);
        res.sendStatus(400);
    }
});

router.post('/', async (req, res) => {
    const data = req.body;

    // verify validity of author id
    let author_id = null;
    try {
        author_id = ObjectId(data.author);
    }
    catch(error) {
        console.error(error);
        res.sendStatus(400);
        return
    }

    // verify author exists in db
    try {
        await animals.get(author_id)
    }
    catch(error) {
        console.error(error);
        res.sendStatus(404)
    }

    // create post
    try {
        const result = await posts.create(data.title, author_id, data.content);
        res.send(await getFormattedPostData(result))
    }
    catch(error) {
        console.error(error);
        res.sendStatus(404)
    }
});

router.put('/:id', async (req, res) => {
    let id = null;
    try {
        id = ObjectId(req.params.id);
        try {
            await posts.get(id);
        }
        catch(error) {
            console.error(error);
            res.sendStatus(404);
            return;
        }
        const result = await posts.updatePost(id, req.body.newTitle, req.body.newContent);
        res.send(await getFormattedPostData(result))
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
        try {
            await posts.get(id);
        }
        catch(error) {
            console.error(error);
            res.sendStatus(404);
            return;
        }
        const result = await posts.remove(id);
        result.data = await getFormattedPostData(result.data);
        res.send(result)
    }
    catch(error) {
        console.error(error);
        res.sendStatus(400);
    }

});


module.exports = router;
