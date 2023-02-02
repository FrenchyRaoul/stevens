function newIngredient() {
    let retval = true;

    const span = document.getElementById('name-error');
    const name = document.forms["ingredient-form"]["ingredient_name"].value;
    if (name === "") {
        span.innerText = "Ingredient must have a name!";
        retval = false;
    }
    else {
        span.innerText = '';
    }

    return retval;
}
