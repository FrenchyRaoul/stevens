// importing the data functions for recipe creation. Perhaps move all of this to data
const {
    createRecipe, getRecipe, getRecipes, updateRecipe, validateRecipeUpdate, postComment, getRecipeContainingComment,
    deleteComment
} = require('../data/recipes');
const express = require('express');
const router = express.Router();
const {ObjectId} = require('mongodb');



// Middleware #1 *and* #2 (applied to different routes)
async function checkAuthenticated(req, res, next) {
    if (!req.session.user) {
        res.status(401).json({"error": "you are not currently logged in, this request cannot be completed"});
    }
    else {
        next()
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////       ROUTES        //////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Middleware #1: applied to *all* post, put, and patch in /recipes
router.post('*',  checkAuthenticated);
router.put('*',   checkAuthenticated);
router.patch('*', checkAuthenticated);

router.get('/', async (req, res) => {
    let recipes = undefined;
    try {
        recipes = await getRecipes(req.query.page);
        if (!recipes.length) {
            res.status(404).json({"error": "no recipes found"});
        } else {
            res.json(recipes);
        }
    } catch (e) {
        res.status(400).json({"error": e});
    }
})

router.post('/', async (req, res) => {
    try {
        let recipe = req.body;
        recipe.userThatPosted = {"_id": req.session.user.userId, "username": req.session.user.username};
        recipe.comments = [];
        recipe.likes = [];
        recipe = await createRecipe(recipe);
        res.json(recipe);
    } catch (e) {
        res.status(400).json({"error": e});
    }
})

router.get('/:id', async (req, res) => {
    try {
        let recipe = await getRecipe(req.params.id);
        res.json(recipe)
    } catch (e) {
        res.status(404).json({"error": `no recipe found with id ${req.params.id}`});
    }
})

function isObjectEmpty(object) {
    return Object.keys(object).length === 0;
}

function checkArraysEqual(array1, array2) {
    if (!Array.isArray(array1)) return false;
    if (!Array.isArray(array2)) return false;
    if (array1.length !== array2.length) return false;
    for (let i = 0; i < array1.length; ++i) {
        if (array1[i] !== array2[i]) return false;
    }
    return true;
}

function createPatchObject(original, update) {
    let newObject = {};
    for (let prop in original) {  // iterate over all properties
        if (original.hasOwnProperty(prop)) {   // ignore "hidden" properties
            if (update[prop]) {
                if (Array.isArray(original[prop])) {
                    if (!checkArraysEqual(original[prop], update[prop])) newObject[prop] = update[prop];
                }
                else if (update[prop] !== original[prop]) newObject[prop] = update[prop];
            }
        }
    }
    return newObject
}

router.patch('/:id', async (req, res) => {
    const reqBody = req.body;
    let oldRecipe = undefined;
    try {
        oldRecipe = await getRecipe(req.params.id);
    } catch (e) {
        res.status(404).json({"error": e});
        return
    }

    if (req.session.user.userId !== oldRecipe.userThatPosted._id) {
        res.status(403).json({"error": "you are not permitted to patch this recipe"});
        return
    }

    if (reqBody.hasOwnProperty("comments")
        || reqBody.hasOwnProperty("likes")
        || reqBody.hasOwnProperty("_id")
        || reqBody.hasOwnProperty("userThatPosted"))
    {
        res.status(403).json({"error": "you are not permitted to make changes to comments, likes, _id, or userThatPosted"});
        return
    }

    const newObject = createPatchObject(oldRecipe, reqBody);
    if (isObjectEmpty(newObject)) {
        res.status(400).json({"error": "no difference between patch and existing object"})
    }
    else {
        try {
            await validateRecipeUpdate(newObject);
        } catch (e) {
            res.status(400).json({"error": e});
            return
        }
        try {
            const result = await updateRecipe(req.params.id, newObject);
            res.json(result);
        } catch (e) {
            res.status(500).json({"error": e});
        }
    }
})

// Middleware #2: Check authentication prior to handling the post as per lab instructions
router.post('/:id/comments', [checkAuthenticated,
    async (req, res) => {
    const {comment} = req.body;
    try {
        await getRecipe(req.params.id);
    } catch {
        res.status(404).json({"error": `no recipe found with id ${req.params.id}`})
        return
    }
    try {
        const recipe = await postComment(req.params.id, comment, req.session.user);
        res.json(recipe);
    } catch (e) {
        res.status(400).json({"error": e})
    }
}])

// for debug
router.get('/:recipeId/:commentId', async (req, res) => {
    const { recipeId, commentId } = req.params;
    try {
        const comment = await getRecipeContainingComment(recipeId, commentId);
        res.json(comment);
    } catch (e) {
        res.status(404).json({"error": e})
    }
})

// Middleware #2: Check authentication prior to handling delete
router.delete('/:recipeId/:commentId', [checkAuthenticated,
    async (req, res) => {
    const { recipeId, commentId } = req.params;
    let recipe = undefined;
    try {
        recipe = await getRecipeContainingComment(recipeId, commentId);
    } catch (e) {
        res.status(404).json({"error": e});
        return
    }

    let owner = undefined;
    for (const comment of recipe.comments) {
        if (comment._id.toString() === commentId) {
            owner = comment.userThatPostedComment._id;
        }
    }
    if (owner === undefined) {
        res.status(500).json({"error": "could not determine user owner of comment"});
        return
    }

    if (req.session.user.userId !== owner) {
        res.status(403).json({"error": "you do not have permission to delete this comment"});
        return
    }

    try {
        const comment = await deleteComment(recipeId, commentId);
        res.json(comment);
    } catch (e) {
        res.status(500).json({"error": e})
    }
}])

router.post(':id/likes', async (req, res) => {
    res.send(`user is looking to like recipt ${req.params.id}`)
})

module.exports = router;