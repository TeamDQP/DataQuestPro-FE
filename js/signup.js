const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    const email_opt_in = formData.get('email_opt_in') === 'agree';

    fetch('http://localhost:8000/user/register/', {
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
            if (response.ok) {
                response.json();
            } else {
                throw new Error('회원가입 실패');
            }
        })

        .then((data) => {
            console.log(data);
            window.location.href = '/login';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

// 중복 닉네임 확인
function checkNickname() {
    var nickname = document.getElementById('nickname').value;

    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/check_nickname?nickname=' + nickname, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseText === 'true') {
                alert('중복된 닉네임 입니다.');
            } else {
                alert('사용 가능한 닉네임 입니다.');
            }
        }
    };

    xhr.send();
}

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

// submitButton.addEventListener('click', submitForm);

// function submitForm(event) {
//     event.preventDefault();

//     const form = event.target.closest('form');
//     const formData = new FormData(form);

//     fetch('/user/register/', {
//         method: 'POST',
//         body: formData,
//     }).then((response) => {
//         if (response.status === 201) {
//             location.href = '/login';
//         } else {
//             alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
//         }
//     });
// }

// // 버튼 요소 찾기 및 이벤트 리스너 추가
// const submitButton = document.getElementById('submitBtn');
// submitButton.addEventListener('click', submitForm);
