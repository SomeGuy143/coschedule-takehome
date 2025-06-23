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
//             document.getElementById("listBody").innerHTML += bookRowHtml;
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }

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
            document.getElementById("listBody").classList.remove("split", "left");
            document.getElementById("commentSection").classList.remove("split", "right");
            document.getElementById("commentSection").hidden = true;
        } else {
            document.getElementById("commentSection").setAttribute("data-isbn13", clickedISBN) // set isbn13 on commentSection so we can tell whether to show or hide it next time a row is clicked
            document.getElementById("listBody").classList.add("split", "left");
            document.getElementById("commentSection").classList.add("split", "right");
            document.getElementById("commentSection").hidden = false;
        }
    })
});