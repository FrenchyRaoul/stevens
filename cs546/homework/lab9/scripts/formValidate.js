$(document).ready(function() {

    function isPrime(number) {
        $('#attempts').append(`<li class="is-prime">${number} is a prime number</li>`);
    }

    function notPrime(number) {
        $('#attempts').append(`<li class="not-prime">${number} is NOT a prime number</li>`);
    }

    $('#data').submit(function(e) {
        e.preventDefault();
        const number = $('#number').val();

        $(".error").remove();

        if (number.length < 1) {
            $('#submit').after('<br/><span class="error">You must enter in a positive integer!</span>');
        } else {
            var regEx = /^[0-9]+$/;
            var isInt = regEx.test(number);
            if (!isInt) {
                $('#submit').after('<br/><span class="error">Invalid! Enter a valid positive integer!</span>');
            }
            else {
                //check if prime
                const int = Number.parseInt(number);
                if (int < 3) {
                    if (int === 2) {
                        isPrime(number)
                    }
                    else {
                        notPrime(number)
                    }
                }
                else {
                    for (var n = 2; n < int; n++) {
                        if (int % n === 0) {
                            notPrime(number);
                            return;
                        }
                    }
                    isPrime(number)
                }
            }
        }
    });

});
