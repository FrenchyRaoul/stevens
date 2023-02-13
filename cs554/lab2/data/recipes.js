const {recipeCollection} = require('./collections');
const {ObjectId} = require('mongodb');

const redis = require('redis');
const client = redis.createClient();

client.on('connect', function () {
    console.log('Connected!');
});

const recipes_per_page = 50;

async function validateRecipeTitle(title) {
    if (typeof title != 'string') throw `title must exist and be a string, found: ${typeof title}`;
    if (!title.trim() || title.trim().length <= 3) throw "title must be longer than three characters (excluding whitespace)";
}

function isIngredientValid(ingredient) {
    return !(                                // note the double negatives, would be better to not have that
        (typeof ingredient != 'string') ||  // ingredient must be a string
        (3 > ingredient.trim().length) ||  // ingredient must be >3 characters
        (ingredient.trim().length >= 50));   // ingredient must be <51 characters
}

async function validateIngredients(ingredients) {
    if (!Array.isArray(ingredients)) throw `ingredients must be an array, found: ${typeof ingredients}`;
    if (ingredients.length < 3) throw `a recipe must include at least three ingredients, found (${ingredients.length})`;
    const bad_ingredients = ingredients.filter(ingredient => !isIngredientValid(ingredient));
    if (bad_ingredients.length) {
        throw `there were (${bad_ingredients.length}) bad ingredients. ingredients must start with a letter, and be between 3 and 50 characters long: (${bad_ingredients})`;
    }
}

function validateStep(step) {
    return (typeof step == 'string') && (step.length >= 20);
}

async function validateSteps(steps) {
    if (!Array.isArray(steps)) throw `steps must be an array, found: ${typeof steps}`;
    if (steps.length < 5) throw `a recipe must include at least five steps, found (${steps.length})`;
    const bad_steps = steps.filter(step => !validateStep(step));
    if (bad_steps.length) {
        throw `recipe steps must be at least 20 characters long, trimmed. there were (${bad_steps.length}) steps that did not meet this requirement.`;
    }
}

async function validateCookingSkill(skill) {
    const skills = ["novice", "intermediate", "advanced"];
    if (!skills.includes(skill.toLocaleLowerCase())) throw `skill level must be \"Novice\", \"Intermediate\", or \"Advanced\". found: ${skill}`;
}

async function validateRecipe(recipe) {
    let title, ingredients, steps, cookingSkillRequired;
    try {
        ({title, ingredients, steps, cookingSkillRequired} = recipe);
    } catch (e) {
        throw "recipe missing fields. recipe must include: title, ingredients, steps, cookingSkillRequired";
    }
    await validateRecipeTitle(title);
    await validateIngredients(ingredients);
    await validateSteps(steps);
    await validateCookingSkill(cookingSkillRequired);
}

async function getRecipe(id) {
    if (id === undefined) throw "recipe id must be defined";
    let recipe_object = undefined;
    try {
        recipe_object = ObjectId(id);
    } catch (e) {
        throw `bad object id: ${e}`;
    }
    const recipe = await (await recipeCollection()).findOne({ _id: recipe_object });
    if (recipe === null) throw `no recipe found for id: ${id}`;
    return recipe
}


async function getRecipes(page) {
    const page_number = (page === undefined) ? 0 : parseInt(page);
    if (isNaN(page_number) || page_number < 0) throw "if a page number is provided, it must be a positive integer";

    console.log(`getting page ${page_number}`);
    const rCollection = await recipeCollection();
    return await rCollection.find({}).sort( { _id: 1} ).skip(page_number * recipes_per_page).limit(recipes_per_page).toArray();
}


async function createRecipe(recipe) {
    await validateRecipe(recipe);
    const rCollection = await recipeCollection();
    const result = await rCollection.insertOne(recipe);
    return await getRecipe(result.insertedId);
}

async function validateRecipeUpdate(updateObject) {
    if (updateObject["title"]) await validateRecipeTitle(updateObject["title"]);
    if (updateObject["ingredients"]) await validateIngredients(updateObject["ingredients"]);
    if (updateObject["steps"]) await validateSteps(updateObject["steps"]);
    if (updateObject["skill"]) await validateCookingSkill(updateObject["skill"]);
}

async function updateRecipe(id, updateObject) {
    // validation of the update object is handled by the caller function to separate out 404 and 500 statuses
    let recipe_object = undefined;
    try {
        recipe_object = ObjectId(id);
    } catch (e) {
        throw `bad object id: ${e}`;
    }

    const rCollection = await recipeCollection();
    try {
        await rCollection.updateOne({ _id: recipe_object }, { $set: updateObject });
    } catch (e) {
        throw `failed to update recipe: ${e}`;
    }
    return await getRecipe(id);
}

async function validateComment(comment) {
    if (comment === undefined) throw "comment must be provided";
    if (!(typeof comment === 'string')) throw "comment must be a string";
    if (comment.length < 3) throw "comment must be greater than two characters";
}

async function postComment(recipeId, comment, user) {
    if (recipeId === undefined) throw "recipeId must be defined";
    if (user === undefined) throw "user must be provided";

    let recipe_object = undefined;
    try {
        recipe_object = ObjectId(recipeId);
    } catch (e) {
        throw `bad object id: ${e}`;
    }

    await validateComment(comment);
    const newComment = {
        _id: new ObjectId(),
        "userThatPostedComment": {
            _id: user.userId,
            username: user.username
        },
        "comment": comment};
    const rCollection = await recipeCollection();
    try {
        await rCollection.updateOne(
            { _id: recipe_object },
            { $push: { comments: newComment}});
    } catch (e) {
        throw `I failed to insert a comment on this recipe: ${e}`;
    }
    return await getRecipe(recipeId);
}

async function getRecipeContainingComment(recipeId, commentId) {
    if (recipeId === undefined) throw "recipeId must be defined";
    if (commentId === undefined) throw "commentId must be defined";
    const rCollection = await recipeCollection();

    let comment_object = undefined;
    let recipe_object = undefined;
    try {
        comment_object = ObjectId(commentId);
        recipe_object = ObjectId(recipeId)
    } catch (e) {
        throw `bad object id: ${e}`;
    }
    const comment = await rCollection.findOne(
        {_id: recipe_object, "comments._id": comment_object},
        "comments.$",
    );
    if (comment === null) throw `no comment found for recipeId ${recipeId} commentId ${commentId}`;
    return comment
}

async function deleteComment(recipeId, commentId) {
    if (recipeId === undefined) throw "recipeId must be defined";
    if (commentId === undefined) throw "commentId must be defined";
    let comment_object = undefined;
    let recipe_object = undefined;
    try {
        comment_object = ObjectId(commentId);
        recipe_object = ObjectId(recipeId);
    } catch (e) {
        throw `bad object id: ${e}`;
    }

    const rCollection = await recipeCollection();
    const comment = await rCollection.updateOne(
        {_id: recipe_object, "comments._id": comment_object},
        {$pull: {comments: {_id: comment_object}}}
    )
    if (comment.modifiedCount !== 1) throw `failed to delete recipeId ${recipeId} commentId ${commentId}`;
    return await getRecipe(recipeId)
}

async function likeRecipe(recipeId, userId) {
    if (recipeId === undefined) throw "recipeId must be defined";
    if (userId === undefined) throw "userId must be provided";

    const recipe = await getRecipe(recipeId);

    let update = undefined;
    const rCollection = await recipeCollection();
    if (recipe.likes.includes(userId)) {
        try {
            update = await rCollection.updateOne(
                {_id: recipe._id},
                {$pull: {likes: userId}});
        } catch (e) {
            throw `I failed to unlike this recipe: ${e}`;
        }
    } else {
        try {
            update = await rCollection.updateOne(
                {_id: recipe._id},
                {$push: {likes: userId}});
        } catch (e) {
            throw `I failed to like this recipe: ${e}`;
        }
        // add user id
    }
    if (update.modifiedCount !== 1) throw "i failed to like/unlike the recipe"
    return await getRecipe(recipeId);
}


module.exports = {
    createRecipe, getRecipe, getRecipes, updateRecipe, validateRecipeUpdate, postComment, getRecipeContainingComment,
    deleteComment, likeRecipe
}