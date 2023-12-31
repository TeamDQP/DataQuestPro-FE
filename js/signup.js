const BaseUrl = 'http://15.164.56.233';
const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    const email_opt_in = formData.get('email_opt_in');

    fetch(BaseUrl + '/user/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            email_opt_in: email_opt_in,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('회원가입 실패');
            }
            return response.json();
        })

        .then((data) => {
            console.log(data);
            window.location.href = '/html/login.html';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('회원가입 실패');
        });
});

// 비밀번호 확인
function validateForm() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('password_confirm').value;

    if (password != confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return false;
    }

    return true;
}
