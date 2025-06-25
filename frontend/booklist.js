// this populates the best seller list with a default list
window.onload = async function() {
    try {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

        const response = await fetch(`http://localhost:8080/nytbooks/${formattedDate}/combined-print-and-e-book-fiction`);
        const data = await response.json();

        for (let i = 0; i < data.results.books.length; i++) {
            let bookRowHtml = `<div class="bookRow" data-isbn13="${data.results.books[i].primary_isbn13}">
                                    <img class="bookCover" src="${data.results.books[i].book_image}" />
                                    <div>
                                        <p class="bookTitle">${data.results.books[i].title}</p>
                                        <p>${data.results.books[i].description}</p>
                                    </div>
                                </div>`;
            document.getElementById("listInnerScrollContainer").innerHTML += bookRowHtml;
        }
        registerBookRowClickEvent();
    } catch (error) {
        console.error(error);
    }
}

// event listener for clicking the search button
document.getElementById("search").addEventListener("click", async function(event) {
    try {
        const selectedDateVal = document.getElementById("date").value;
        const selectedListVal = document.getElementById("list").value;

        let response = await fetch(`http://localhost:8080/nytbooks/${selectedDateVal}/${selectedListVal}`);
        let data = await response.json();

        document.getElementById("listInnerScrollContainer").innerHTML = "";

        for (let i = 0; i < data.results.books.length; i++) {
            let bookRowHtml = `<div class="bookRow" data-isbn13="${data.results.books[i].primary_isbn13}">
                                    <img class="bookCover" src="${data.results.books[i].book_image}" />
                                    <div>
                                        <p class="bookTitle">${data.results.books[i].title}</p>
                                        <p>${data.results.books[i].description}</p>
                                    </div>
                                </div>`;
            document.getElementById("listInnerScrollContainer").innerHTML += bookRowHtml;
        }
        registerBookRowClickEvent();
    } catch (error) {
        console.error(error);
    }
});

// this click event splits/unsplits the screen to show or hide the comment section
function registerBookRowClickEvent() {
    document.querySelectorAll(".bookRow").forEach((bookRow) => {
        bookRow.addEventListener("click", async function(event) {
            // set background to white for all other book rows
            document.querySelectorAll(".bookRow").forEach((bookRow) => {
                if (bookRow !== this) {
                    bookRow.style.background = "white";
                }
            });
            
            // flip the current color of the clicked row
            this.style.background = this.style.background === "lightgray" ? "white" : "lightgray";
    
            const commentSectionISBN = document.getElementById("commentSection").getAttribute("data-isbn13");
            const clickedISBN = this.getAttribute("data-isbn13");
            const commentsVisible = !document.getElementById("commentSection").hidden;
    
            if (commentSectionISBN === clickedISBN && commentsVisible) {
                // remove css classes to split the screen
                document.getElementById("listBody").classList.remove("split", "left");
                document.getElementById("commentSection").classList.remove("split", "right");
                // remove css classes to add margin to bottom of split screen
                document.getElementById("listInnerScrollContainer").classList.remove("verticalScrollMargin");
                document.getElementById("postedCommentsContainer").classList.remove("verticalScrollMargin");
                
                document.getElementById("commentSection").hidden = true;
            } else {
                // set isbn13 on commentSection so we can tell whether to show or hide it next time a row is clicked
                document.getElementById("commentSection").setAttribute("data-isbn13", clickedISBN)
                // add css classes to split the screen
                document.getElementById("listBody").classList.add("split", "left");
                document.getElementById("commentSection").classList.add("split", "right");
                // add css classes to add margin to bottom of split screen
                document.getElementById("listInnerScrollContainer").classList.add("verticalScrollMargin");
                document.getElementById("postedCommentsContainer").classList.add("verticalScrollMargin");
    
                await loadComments(clickedISBN);
                await loadRatingsInfo(clickedISBN);
    
                document.getElementById("commentSection").hidden = false;
            }
        })
    });
}

document.getElementById("addCommentButton").addEventListener("click", async function(event) {
    const textBoxContents = document.getElementById("addCommentTextArea").value;
    if (!textBoxContents) {
        return;
    }

    const response = await fetch("http://localhost:8080/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // ********** for now, just set userid to 1. we probably derrive that in the backend via the session token **********
        body: JSON.stringify({ text: textBoxContents, isbn13: document.getElementById("commentSection").getAttribute("data-isbn13"), userid: 1 }),
    });

    if (response.status != 200) {
        console.error(response);
        return;
    } else {
        await loadComments(document.getElementById("commentSection").getAttribute("data-isbn13"));
    }
});

async function loadComments(isbn13) {
    // get the comments for the book
    const getCommentsURL = new URL("http://localhost:8080/comments");
    getCommentsURL.searchParams.append("isbn13", isbn13);
    const result = await fetch(getCommentsURL);
    const data = await result.json();

    document.getElementById("postedCommentsContainer").innerHTML = "";

    // add html for posted comments
    for (let i = 0; i < data.length; i++) {
        let commentRowHTML =  `<div class="commentRow">
                                    <p class="userName">${data[i].username}</p>
                                    <p>${data[i].text}</p>
                                </div>`;

        document.getElementById("postedCommentsContainer").innerHTML += commentRowHTML;
    }
}

async function loadRatingsInfo(isbn13) {
    // get the avergae rating for the book
    const getRatingsURL = new URL(`http://localhost:8080/ratings/average/${isbn13}`);
    let result = await fetch(getRatingsURL);
    let data = await result.json();

    document.getElementById("avgRating").innerText = data.avg ?? "Not yet rated";

    // get the user's rating of the book
    const getRatingURL = new URL(`http://localhost:8080/ratings`);
    getRatingURL.searchParams.append("userid", 1);  // ************** TEMPORARILY SET THIS TO 1 ******************
    getRatingURL.searchParams.append("isbn13", isbn13);
    result = await fetch(getRatingURL);
    data = await result.json();

    const userRatingInputElement = document.getElementById("userRating");
    const userRating = data.length > 0 ? data[0].score : "";
    const ratingID = data.length > 0 ? data[0].id : "";
    userRatingInputElement.value = userRating;
    userRatingInputElement.setAttribute("data-id", ratingID);
}

document.getElementById("submitRating").addEventListener("click", async function(event) {
    const userRating = document.getElementById("userRating").value;
    const bookISBN = document.getElementById("commentSection").getAttribute("data-isbn13");
    
    const response = await fetch("http://localhost:8080/ratings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // ********** for now, just set userid to 1. we probably derrive that in the backend via the session token **********
        body: JSON.stringify({ score: userRating, isbn13: bookISBN, userid: 1 }),
    });
    
    await loadRatingsInfo(bookISBN);
});

document.getElementById("clearRating").addEventListener("click", async function(event) {
    const userRatingID = document.getElementById("userRating").getAttribute("data-id");
    
    const getRatingsURL = new URL(`http://localhost:8080/ratings/${userRatingID}`);
    let result = await fetch(getRatingsURL, { method: "DELETE" });
    
    const commentSectionISBN = document.getElementById("commentSection").getAttribute("data-isbn13");
    await loadRatingsInfo(commentSectionISBN);
});