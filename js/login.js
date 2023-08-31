const BaseUrl = 'http://15.164.56.233/api';
const loginForm = document.getElementById('login-form');
const signupButton = document.querySelector('.signup-btn');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        alert('이메일과 비밀번호를 모두 입력해주세요.');
        return;
    }

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
            if (data.access && data.access !== 'undefined') {
                localStorage.setItem('token', data.access);
                window.location.href = './survey_list.html';
            } else {
                alert('로그인 실패: 잘못된 이메일 또는 비밀번호');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(`로그인 실패: ${error.message}`);
    });
});

// 회원가입버튼누르면 signup으로 이동
signupButton.addEventListener('click', () => (location.href = './signup.html'));
