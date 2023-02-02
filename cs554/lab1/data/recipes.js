const {recipeCollection} = require('./collections');
const {ObjectId} = require('mongodb');

const recipes_per_page = 50;

async function validateRecipeTitle(title) {
    if (typeof title != 'string') throw `title must exist and be a string, found: ${typeof title}`;
    if (!title.trim() || title.trim().length <= 3) throw "title must be longer than three characters (excluding whitespace)";
}

function isIngredientValid(ingredient) {
    return !(                                // note the double negatives, would be better to not have that
        (typeof ingredient != 'string')  ||  // ingredient must be a string
        (3 > ingredient.trim().length)   ||  // ingredient must be >3 characters
        (ingredient.trim().length >= 50))    // ingredient must be <51 characters
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
    return (typeof step == 'string') && (step.length >= 20)
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
    if (!skills.includes(skill.toLocaleLowerCase())) throw `skill level must be \"Novice\", \"Intermediate\", or \"Advanced\". found: ${skill}`
}

async function validateRecipe(recipe) {
    const { title, ingredients, steps, skill } = recipe;
    await validateRecipeTitle(title);
    await validateIngredients(ingredients);
    await validateSteps(steps);
    await validateCookingSkill(skill);
}

async function getRecipe(id) {
    if (id === undefined) throw "recipe id must be defined";
    const recipe = await (await recipeCollection()).findOne({ _id: ObjectId(id) });
    if (recipe === null) throw `no recipe found for id: ${id}`
    return recipe
}

async function getRecipes(page) {
    const page_number = (page === undefined) ? 0 : parseInt(page) - 1;
    if (isNaN(page_number) || page_number < 0) throw "if a page number is provided, it must be a positive integer";

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
    const rCollection = await recipeCollection();
    try {
        await rCollection.updateOne({ _id: ObjectId(id) }, { $set: updateObject });
    } catch (e) {
        throw `failed to update recipe: ${e}`
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
        console.log(recipeId);
        const inserted = await rCollection.updateOne(
            { _id: ObjectId(recipeId) },
            { $push: { comments: newComment}});
        console.log(`update results: ${inserted.matchedCount} ${inserted.modifiedCount} ${inserted.upsertedId}`)
    } catch (e) {
        throw `I failed to insert a comment on this recipe: ${e}`
    }
    return await getRecipe(recipeId);
}


module.exports = { createRecipe, getRecipe, getRecipes, updateRecipe, validateRecipeUpdate, postComment }