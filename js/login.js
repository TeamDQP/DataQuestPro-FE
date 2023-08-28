const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    fetch('http://localhost:8000/user/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then((response) => {
            if (response.ok) {
                response.json();
            } else {
                throw new Error('로그인 실패');
            }
        })
        .then((data) => {
            console.log(data);
            window.location.href = '/survey_list.html';
            console.log('success');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('아이디나 비밀번호가 일치하지 않습니다.');
        });
});

// 회원가입버튼누르면 signup으로 이동
const signupButton = document.querySelector('.signup-btn');

signupButton.addEventListener('click', function () {
    location.href = '/signup.html';
});
