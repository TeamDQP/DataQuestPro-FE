document
    .getElementById('signup-form')
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

submitButton.addEventListener('click', submitForm);

function submitForm(event) {
    event.preventDefault();

    const form = event.target.closest('form');
    const formData = new FormData(form);

    fetch('/user/register/', {
        method: 'POST',
        body: formData,
    }).then((response) => {
        if (response.status === 201) {
            location.href = '/login';
        } else {
            alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
        }
    });
}

// 버튼 요소 찾기 및 이벤트 리스너 추가
const submitButton = document.getElementById('submitBtn');
submitButton.addEventListener('click', submitForm);
