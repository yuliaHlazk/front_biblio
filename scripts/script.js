$(document).ready(function () {
    const API_BOOKS = "http://127.0.0.1:8000/api/books/";
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");


    if (token) {
        $("#login-btn").hide();
        $("#logout-btn").show();
        $("#username-label").text("Hello, " + username);
    } else {
        $("#logout-btn").hide();
        $("#login-btn").show();
        $("#username-label").text("");
    }

    $("#logout-btn").click(function () {
        localStorage.clear();
        window.location.reload();
    });

    $("#login-btn").click(function () {
        window.location.href = "login.html";
    });

    function loadBooks() {
        $("#books-container").html("Loading...");

        $.ajax({
            url: API_BOOKS,
            type: "GET",
            success: function (books) {
                $("#books-container").empty();
                if (!books.length) {
                    $("#books-container").html("<p>No books found</p>");
                    return;
                }

                books.forEach((b) => {
                    const author = b.author_name || b.author?.name || "Unknown";
                    const shortDesc = b.description
                        ? b.description.split(" ").slice(0, 5).join(" ") + "..."
                        : "No description";

                    const card = $(`
                        <div class="book-card">
                            <h3>${b.title}</h3>
                            <p><b>Author:</b> ${author}</p>
                            <p><b>Genre:</b> ${b.genre}</p>
                            <p><b>Price:</b> ${b.price} ₴</p>
                            <p>${shortDesc}</p>
                            <button class="view-details" data-id="${b.id}">View details</button>
                        </div>
                    `);
                    $("#books-container").append(card);
                });
            },
            error: function () {
                $("#books-container").html("Failed to load books");
            },
        });
    }

    $("#books-container").on("click", ".view-details", function () {
        const bookId = $(this).data("id");

        if (!token) {
            alert("Log in to view detailed information");
            window.location.href = "login.html";
            return;
        }

        window.location.href = `private.html?book=${bookId}`;
    });

    $("#reload-books").on("click", loadBooks);
    loadBooks();
});
