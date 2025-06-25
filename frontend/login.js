document.getElementById("login").addEventListener("click", async function(event) {
    // submit the credentials to a login endpoint
    // if success: set whatever userID / session token in the browser, then redirect to main page
    // if failed: display failure text to user in loginErrorText element

    window.location.href = "./booklist.html";
});

document.getElementById("signup").addEventListener("click", async function(event) {
    // submit the credentials to a signup endpoint
    // set whatever userID / session token in the browser, then redirect to main page

    window.location.href = "./booklist.html";
});

// ************** DONT FORGET CLEAN UP PLACEHOLDER USERID LOGIC **************