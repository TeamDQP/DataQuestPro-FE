const BaseUrl = 'http://127.0.0.1:8000';
const loginForm = document.getElementById('login-form');
const signupButton = document.querySelector('.signup-btn');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    fetch(BaseUrl + '/user/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    })
    .then((response) => {
            return response.json();
    })
    .then((data) => {
            localStorage.setItem('token', data.access);
            window.location.href = './survey_list.html';
    })
    .catch((error) => {
            console.error('Error:', error);
            alert(`로그인 실패: ${error.message}`);
    });
});

// 회원가입버튼누르면 signup으로 이동
signupButton.addEventListener('click', () => (location.href = './signup.html'));
