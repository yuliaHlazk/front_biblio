
$(document).ready(function () {
    const API_URL = "http://127.0.0.1:8000/api/books/";

    $("#load-books").click(function () {
        $.ajax({
            url: API_URL,
            type: "GET",
            success: function (data) {
                $("#books-container").empty();

                data.forEach(book => {
                    const card = `
                        <div class="book-card">
                            <h3>${book.title}</h3>
                            <p><strong>Author:</strong> ${book.author ? book.author.name : '—'}</p>
                            <p><strong>Publisher:</strong> ${book.publisher ? book.publisher.name : '—'}</p>
                            <p><strong>Genre:</strong> ${book.genre}</p>
                            <p><strong>Price:</strong> ${book.price} ₴</p>
                        </div>
                    `;
                    $("#books-container").append(card);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error loading books:", error);
                alert("Failed to load books. Check console for details.");
            }
        });
    });
});
