function newRecipe() {
    let retval = true;

    let span = document.getElementById('ingredients-error');
    const ingredients = document.getElementsByName("ingredients");
    let checked = 0;
    for (const ingredient in ingredients) {
        if (ingredients[ingredient].checked) {
            checked += 1;
        }
    }
    if (checked < 2) {
        span.innerText = 'You must include at least two ingredients!';
        retval = false;
    }
    else {
        span.innerText = '';
    }

    span = document.getElementById('steps-error');
    const steps = document.forms["recipe-form"]["steps"].value;
    if (steps === "") {
        span.innerText = "You must provide some instructions!";
        retval = false;
    }
    else {
        span.innerText = '';
    }

    span = document.getElementById('name-error');
    const name = document.forms["recipe-form"]["name"].value;
    if (name === "") {
        span.innerText = "Recipe must have a name!";
        retval = false;
    }
    else {
        span.innerText = '';
    }

    return retval;
}
