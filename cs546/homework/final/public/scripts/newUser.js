const formToJSON = elements => [].reduce.call(elements, (data, element) => {

    data[element.name] = element.value;
    return data;

}, {});

function newUser() {
    let retval = true;

    let span = document.getElementById('username-error');
    const username = document.forms["newuser"]["username"].value;
    if (username === "") {
        span.innerText = 'Username cannot be empty!';
        retval = false;
    }
    else {
        span.innerText = '';
    }

    span = document.getElementById('firstname-error');
    const firstname = document.forms["newuser"]["firstName"].value;
    if (firstname === "") {
        span.innerText = "First name cannot be empty!";
        retval = false;
    }
    else {
        span.innerText = '';
    }

    span = document.getElementById('lastname-error');
    const lastname = document.forms["newuser"]["lastName"].value;
    if (lastname === "") {
        span.innerText = "Last name cannot be empty!";
        retval = false;
    }
    else {
        span.innerText = '';
    }

    span = document.getElementById('password-error');
    const password = document.forms["newuser"]["password"].value;
    if (password === "") {
        span.innerText = "Password cannot be empty!";
        retval = false;
    }
    else {
        const patt = /^[a-zA-Z0-9_\-+=<>()[\]{}]{4,}$/;
        if (!(password.match(patt))) {
            span.innerText = "Password must be at least 4 characters, and contain only letters, numbers, and _-+=<>()[]{}";
            retval = false;
        }
        else {
            span.innerText = '';
        }
    }


    if (retval) {
        const data = formToJSON(document.forms["newuser"].elements);

        const xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("POST", "/u");
        xmlhttp.setRequestHeader("Content-Type", "application/json");

        xmlhttp.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    location.replace("/")
                }
                else if (this.status === 403) {
                    let span = document.getElementById('username-error');
                    span.innerText = "This username is already taken.";
                }
            }
        };

        xmlhttp.send(JSON.stringify(data));
    }
    return false;
}

