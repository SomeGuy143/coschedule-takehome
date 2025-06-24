// this populates the best seller list with a default list
// window.onload = async function () {
//     try {
//         const today = new Date();
//         const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

//         var response = await fetch(`http://localhost:8080/nytbooks/2025-05-04/combined-print-and-e-book-fiction`);
//         var data = await response.json();

//         for (var i = 0; i < data.results.books.length; i++) {
//             var bookRowHtml = `<div class="bookRow" data-isbn13="${data.results.books[i].primary_isbn13}">
//                                     <img class="bookCover" src="${data.results.books[i].book_image}" />
//                                     <div>
//                                         <p class="bookTitle">${data.results.books[i].title}</p>
//                                         <p>${data.results.books[i].description}</p>
//                                     </div>
//                                 </div>`;
//             document.getElementById("listInnerScrollContainer").innerHTML += bookRowHtml;
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }

// event listener for clicking the search button
document.getElementById("search").addEventListener("click", async function (event) {
    try {
        var selectedDateVal = document.getElementById("date").value;
        var selectedListVal = document.getElementById("list").value;

        var response = await fetch(`http://localhost:8080/nytbooks/${selectedDateVal}/${selectedListVal}`);
        var data = await response.json();

        document.getElementById("listInnerScrollContainer").innerHTML = "";

        for (var i = 0; i < data.results.books.length; i++) {
            var bookRowHtml = `<div class="bookRow" data-isbn13="${data.results.books[i].primary_isbn13}">
                                    <img class="bookCover" src="${data.results.books[i].book_image}" />
                                    <div>
                                        <p class="bookTitle">${data.results.books[i].title}</p>
                                        <p>${data.results.books[i].description}</p>
                                    </div>
                                </div>`;
            document.getElementById("listInnerScrollContainer").innerHTML += bookRowHtml;
        }
    } catch (error) {
        console.error(error);
    }
});

// this click event listener splits/unsplits the screen to show or hide the comment section
document.querySelectorAll(".bookRow").forEach((bookRow) => {
    bookRow.addEventListener("click", function (event) {
        // set background to white for all other book rows
        document.querySelectorAll(".bookRow").forEach((bookRow) => {
            if (bookRow !== this) {
                bookRow.style.background = "white";
            }
        });
        
        // flip the current color of the clicked row
        this.style.background = this.style.background === "lightgray" ? "white" : "lightgray";

        var commentSectionISBN = document.getElementById("commentSection").getAttribute("data-isbn13");
        var clickedISBN = this.getAttribute("data-isbn13");
        var commentsVisible = !document.getElementById("commentSection").hidden;

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

            document.getElementById("commentSection").hidden = false;
        }
    })
});

// template for comment
// to be inserted into innerHTML of postedCommentsContainer (id) element
{/* <div class="commentRow">
        <p class="userName">User Name</p>
        <p>Comment...</p>
    </div> */}