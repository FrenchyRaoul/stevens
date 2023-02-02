const collections = require("./collections");
const ObjectId = require('mongodb').ObjectID;
const posts = collections.posts;

async function create(title, author, content) {
    if (!title || !author || !content) throw "content, title, and author cannot be empty";
    if (!(typeof(title) === 'string')) throw "title must be a string";
    if (!(author instanceof ObjectId)) throw "parameter author must be an ObjectId type";
    if (!(typeof(content) === 'string')) throw "content must be a string";


    const post_collection = await posts();

    const post = {
        title: title,
        author: author,
        content: content
    };

    const insert = await post_collection.insertOne(post);
    if (insert.insertedCount === 0) throw "could not add post";

    post._id = insert.insertedId;
    return post;
}

async function getAll() {
    const post_collection = await posts();
    return await post_collection.find({}).toArray();
}

async function get(id) {
    if (!id) throw "id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const post_collection = await posts();

    const result = await post_collection.findOne({ _id: id});
    if (!result) throw "no post found with that id";

    return result
}

async function getPostsByUserid(id) {
    if (!id) throw "id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const id_obj = ObjectId(id);
    const post_collection = await posts();

    return await post_collection.find({author: id_obj}).toArray();
}

async function remove(id) {
    const post_collection = await posts();
    if (!id) throw "parameter id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const data = await get(id);

    const deleted = await post_collection.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) throw `unable to delete post with id ${id}`;

    return {
        deleted: true,
        data: data
    }
}

async function updatePost(id, newTitle, newContent) {
    if (!id) throw "parameter id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const update = {};
    if (newTitle) {
        if (!(typeof(newTitle) === 'string')) throw "parameter newTitle must be a string type";
        update.title = newTitle;
    }
    if (newContent) {
        if (!(typeof(newContent) === 'string')) throw "parameter newContent must be a string type";
        update.content = newContent;
    }
    if ((update.title) || (update.content)) {
        const post_collection = await posts();
        const results = await post_collection.updateOne({ _id: id}, { $set: update});
        if (results.modifiedCount === 0) {
            throw "could not update title successfully";
        }
        return await get(id);
    }
    else {
        throw "either title or content must be provided"
    }
}

module.exports = {
    create: create,
    getAll: getAll,
    get: get,
    getPostsByUserid: getPostsByUserid,
    remove: remove,
    updatePost: updatePost,
};
