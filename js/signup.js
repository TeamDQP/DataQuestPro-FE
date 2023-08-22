document
    .getElementById('registerForm')
    .addEventListener('submit', function (event) {
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('password_confirm').value;
        const errorMessage = document.getElementById('password_error');

        if (password !== passwordConfirm) {
            event.preventDefault();

            if (!errorMessage) {
                const error = document.createElement('p');
                error.id = 'password_error';
                error.className = 'error';
                error.innerText = '비밀번호가 일치하지 않습니다.';
                document.getElementById('password_confirm').after(error);
            }
        } else if (errorMessage) {
            errorMessage.remove();
        }
    });
