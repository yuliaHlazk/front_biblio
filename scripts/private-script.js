$(document).ready(function () {
    const API_PROFILE = "http://127.0.0.1:8000/api/auth/profile/";
    const API_BOOKS = "http://127.0.0.1:8000/api/books/";
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    if (!token) {
        alert("You must log in to access this page");
        window.location.href = "login.html";
        return;
    }

    $("#username-label").text("Hello, " + (username || "User"));
    $("#logout-btn").click(function () {
        localStorage.clear();
        alert("Logged out successfully");
        window.location.href = "index.html";
    });
    $("#home-btn").click(() => (window.location.href = "index.html"));

    $.ajax({
        url: API_PROFILE,
        type: "GET",
        headers: { Authorization: "Bearer " + token },
        success: (data) => {
            $("#profile-username").text(data.username);
            $("#profile-email").text(data.email || "—");
        },
        error: () => {
            alert("Session expired. Log in again");
            localStorage.clear();
            window.location.href = "login.html";
        },
    });

    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("book");

    if (bookId) {
        $("#book-details").show();
        loadBook(bookId);
    } else {
        $("#books").show();
        loadBooks();
        $("#reload-books").on("click", loadBooks);
    }

    function loadBooks() {
        $("#books-container").html("Loading...");
        $.ajax({
            url: API_BOOKS,
            type: "GET",
            headers: { Authorization: "Bearer " + token },
            success: (books) => {
                $("#books-container").empty();
                if (!books.length) {
                    $("#books-container").html("<p>No books found</p>");
                    return;
                }
                books.forEach((b) => {
                    const author = b.author_name || b.author?.name || "Unknown";
                    const shortDesc = b.description
                        ? b.description.split(" ").slice(0, 5).join(" ") + "..."
                        : "No description.";
                    $("#books-container").append(`
                        <div class="book-card">
                            <h3>${b.title}</h3>
                            <p><b>Author:</b> ${author}</p>
                            <p><b>Genre:</b> ${b.genre}</p>
                            <p><b>Price:</b> ${b.price} ₴</p>
                            <p>${shortDesc}</p>
                            <button class="read-more" data-id="${b.id}">Read more</button>
                        </div>
                    `);
                });
                $(".read-more").click(function () {
                    const id = $(this).data("id");
                    window.location.href = `private.html?book=${id}`;
                });
            },
            error: () => $("#books-container").html("Failed to load books"),
        });
    }

    function loadBook(id) {
        $("#book-container").html("Loading book details...");
        $.ajax({
            url: API_BOOKS + id + "/",
            type: "GET",
            headers: { Authorization: "Bearer " + token },
            success: (b) => {
                const author = b.author?.name || "Unknown";
                const publisher = b.publisher?.name || "—";
                $("#book-container").html(`
                    <div class="book-card">
                        <h2>${b.title}</h2>
                        <p><b>Author:</b> ${author}</p>
                        <p><b>Publisher:</b> ${publisher}</p>
                        <p><b>Genre:</b> ${b.genre}</p>
                        <p><b>Price:</b> ${b.price} ₴</p>
                        <p><b>Description:</b><br>${b.description || "No description"}</p>
                        <button id="back-btn">Back to all books</button>
                    </div>
                `);
                $("#back-btn").click(() => (window.location.href = "private.html"));
            },
            error: () =>
                $("#book-container").html("Failed to load book details"),
        });
    }
});
