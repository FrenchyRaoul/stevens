// importing the data functions for recipe creation. Perhaps move all of this to data
const {
    createRecipe, getRecipe, getRecipes, updateRecipe, validateRecipeUpdate, postComment, getRecipeContainingComment,
    deleteComment, likeRecipe
} = require('../data/recipes');
const {
    checkLoggedIn,
    authCookieName,
    getUserForSessionId,
    getRedis,
    recipeCacheKey,
    hitCountKey
} = require("../data/redis");
const express = require('express');
const router = express.Router();


async function clearPageCache() {
    const client = await getRedis();
    const {keys} = await client.scan(0, {"MATCH": "PAGE_*"});
    for (key of keys) {
        await client.del(key);
    }
}

async function updateRedisRecipe(recipe) {
    const client = await getRedis();
    const id = recipe._id.toString();
    await client.hSet(recipeCacheKey, id, JSON.stringify(recipe));
    await client.zIncrBy(hitCountKey, 1, id);

    await clearPageCache();
}


// Middleware #1 *and* #2 (applied to different routes)
async function checkAuthenticated(req, res, next) {
    if (!(await checkLoggedIn(req))) {
        res.status(401).json({"error": "you are not currently logged in, this request cannot be completed"});
    } else {
        next()
    }
}


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
                } else if (update[prop] !== original[prop]) newObject[prop] = update[prop];
            }
        }
    }
    return newObject
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////       ROUTES        //////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Middleware #1: applied to *all* post, put, and patch in /recipes
router.post('*', checkAuthenticated);
router.put('*', checkAuthenticated);
router.patch('*', checkAuthenticated);


async function getCachedRecipes(req, res, next) {
    const page_number = (req.query.page === undefined) ? 0 : parseInt(req.query.page) - 1;
    if (isNaN(page_number) || page_number < 0) {
        res.status(400).json({"error": "if a page number is provided, it must be a positive integer"})
        return
    }
    const key = `PAGE_${page_number}`
    const client = await getRedis();
    if (await client.exists((key))) {
        const data = JSON.parse(await client.get(key));
        res.json(data)
        return
    }
    next()
}

async function getCachedRecipe(req, res, next) {
    const client = await getRedis();
    let cacheVal = await client.hGet(recipeCacheKey, req.params.id);
    if (cacheVal !== null) {
        const data = JSON.parse(cacheVal);
        res.json(data);
        await client.zIncrBy(hitCountKey, 1, req.params.id);
        return
    }
    next()
}


router.get('/', [getCachedRecipes, async (req, res) => {
    const page_number = (req.query.page === undefined) ? 0 : parseInt(req.query.page) - 1;
    if (isNaN(page_number) || page_number < 0) {
        res.status(400).json({"error": "if a page number is provided, it must be a positive integer"})
        return
    }

    let recipes = undefined;
    try {
        recipes = await getRecipes(page_number);
        if (!recipes.length) {
            res.status(404).json({"error": "no recipes found"});
            return
        }
    } catch (e) {
        res.status(500).json({"error": e});
        return
    }

    res.json(recipes);
    const client = await getRedis();
    const key = `PAGE_${page_number}`;
    await client.set(key, JSON.stringify(recipes));
}])

router.post('/', [async (req, res) => {
    let recipe = req.body;
    const user = await getUserForSessionId(req.cookies[authCookieName]);
    recipe.userThatPosted = {"_id": user._id, "username": user.username};
    recipe.comments = [];
    recipe.likes = [];
    try {
        recipe = await createRecipe(recipe);
        res.json(recipe);
    } catch (e) {
        res.status(400).json({"error": e});
        return
    }
    // push the recipe into the cache an set to accessed = 1
    await updateRedisRecipe(recipe)
}])

router.get('/:id', [getCachedRecipe, async (req, res) => {
    try {
        let recipe = await getRecipe(req.params.id);
        res.json(recipe);
        await updateRedisRecipe(recipe);
    } catch (e) {
        res.status(404).json({"error": `no recipe found with id ${req.params.id}`});
    }
}])


router.patch('/:id', async (req, res) => {
    const reqBody = req.body;
    let oldRecipe = undefined;
    try {
        oldRecipe = await getRecipe(req.params.id);
    } catch (e) {
        res.status(404).json({"error": e});
        return
    }

    const user = await getUserForSessionId(req.cookies[authCookieName]);
    if (user._id !== oldRecipe.userThatPosted._id) {
        res.status(403).json({"error": "you are not permitted to patch this recipe"});
        return
    }

    if (reqBody.hasOwnProperty("comments")
        || reqBody.hasOwnProperty("likes")
        || reqBody.hasOwnProperty("_id")
        || reqBody.hasOwnProperty("userThatPosted")) {
        res.status(403).json({"error": "you are not permitted to make changes to comments, likes, _id, or userThatPosted"});
        return
    }

    let newRecipe;
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
            newRecipe = await updateRecipe(req.params.id, newObject);
            res.json(newRecipe);
        } catch (e) {
            res.status(500).json({"error": e});
            return
        }
        await updateRedisRecipe(newRecipe);
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
        let recipe;
        try {
            const user = await getUserForSessionId(req.cookies[authCookieName]);
            recipe = await postComment(req.params.id, comment, user);
            res.json(recipe);
        } catch (e) {
            res.status(400).json({"error": e})
            return
        }
        await updateRedisRecipe(recipe);
    }])

// for debug
// router.get('/:recipeId/:commentId', async (req, res) => {
//     const { recipeId, commentId } = req.params;
//     try {
//         const comment = await getRecipeContainingComment(recipeId, commentId);
//         res.json(comment);
//     } catch (e) {
//         res.status(404).json({"error": e})
//     }
// })

// Middleware #2: Check authentication prior to handling delete
router.delete('/:recipeId/:commentId', [checkAuthenticated,
    async (req, res) => {
        const {recipeId, commentId} = req.params;
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
        const user = await getUserForSessionId(req.cookies[authCookieName]);
        if (user._id !== owner) {
            res.status(403).json({"error": "you do not have permission to delete this comment"});
            return
        }

        try {
            recipe = await deleteComment(recipeId, commentId);
            res.json(recipe);
        } catch (e) {
            res.status(500).json({"error": e})
            return;
        }
        await updateRedisRecipe(recipe);
    }])

router.post('/:id/likes', async (req, res) => {
    try {
        await getRecipe(req.params.id);
    } catch (e) {
        res.status(404).json({"error": `no recipe found with id ${req.params.id}`});
        return
    }
    const user = await getUserForSessionId(req.cookies[authCookieName]);
    const userId = user._id;
    let recipe;
    try {
        recipe = await likeRecipe(req.params.id, userId);
        res.json(recipe);
    } catch (e) {
        res.status(500).json({"error": `failed to like/unlike recipe: ${e}`})
        return
    }
    await updateRedisRecipe(recipe);
})


module.exports = router;