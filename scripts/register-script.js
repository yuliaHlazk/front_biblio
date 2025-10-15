$(document).ready(function () {
    $('#register-form').on('submit', function (e) {
        e.preventDefault();

        const username = $('#username').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const password2 = $('#password2').val();

        $('#register-status').text('');

        if (password !== password2) {
            $('#register-status').text('Passwords do not match.');
            return;
        }

        $.ajax({
            url: 'http://127.0.0.1:8000/api/auth/register/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                email: email,
                password: password,
                password2: password2
            }),
            success: function (response) {
                $('#register-status').text('Registration successful! Redirecting...');
                console.log('User registered:', response);

                setTimeout(() => window.location.href = 'login.html', 1500);
            },
            error: function (xhr) {
                console.error('Registration error:', xhr);
                let message = 'Registration failed';
                if (xhr.responseJSON) {
                    const data = xhr.responseJSON;
                    if (data.password) message = data.password.join(', ');
                    else if (data.email) message = data.email;
                    else if (data.username) message = data.username.join(', ');
                    else if (data.detail) message = data.detail;
                }

                $('#register-status').text(message);
            }
        });
    });
});
