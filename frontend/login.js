document.getElementById("login").addEventListener("click", async function(event) {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        return;
    }

    const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
    });

    if (response.status != 200) {
        document.getElementById("loginErrorText").innerText = "Login failed, are you sure this user exists? Try signing up instead.";
        console.error(response);
        return;
    } else {
        const data = await response.json();
        sessionStorage.setItem("userid", data.id);
        window.location.href = "./booklist.html";
    }
});

document.getElementById("signup").addEventListener("click", async function(event) {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        return;
    }

    const response = await fetch("http://localhost:8080/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
    });

    if (response.status != 200) {
        document.getElementById("loginErrorText").innerText = "login failed";
        console.error(response);
        return;
    } else {
        const data = await response.json();
        sessionStorage.setItem("userid", data.id);
        window.location.href = "./booklist.html";
    }
});