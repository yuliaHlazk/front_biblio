$(document).ready(function () {
    $('#login-form').on('submit', function (e) {
        e.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        $.ajax({
            url: 'http://127.0.0.1:8000/api/auth/token/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (response) {
                localStorage.setItem('access_token', response.access);
                localStorage.setItem('refresh_token', response.refresh);
                localStorage.setItem('username', username);

                $('#login-status').text('Login successful! Redirecting...');
                setTimeout(() => window.location.href = 'private.html', 1000);
            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.detail || 'Invalid credentials';
                $('#login-status').text('Login failed' + msg);
            }
        });
    });
});
