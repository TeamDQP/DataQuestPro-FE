const token = localStorage.getItem('token');

if (!token) {
    alert('토큰이 유효하지 않습니다. 다시 로그인해주세요.');
}

const userInfoForm = document.querySelector('.newuserinfoinput');
userInfoForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    if (!validateForm()) {
        return;
    }

    const formData = new FormData(userInfoForm);
    const nameValue = formData.get('newname');
    const emailValue = formData.get('newemail');
    const passwordValue = formData.get('newpassword');

    let email_opt_in_setup;
    const radios = document.getElementsByName('email_opt_in_setup');

    // 라디오버튼 순회해서 true 일때 break
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            email_opt_in_setup = radios[i].value === 'true';
            break;
        }
    }

    formData.append('name', nameValue);
    formData.append('email', emailValue);
    formData.append('password', passwordValue);
    formData.append('email_opt_in', email_opt_in_setup);

    axios
        .post('http://localhost:8000/user/update/', formData, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            console.log(response);
            alert('회원 정보가 성공적으로 업데이트 되었습니다.');
            window.location.href = './userinfo.html';
        })
        .catch((error) => {
            if (error.response) {
                console.log(
                    'Server responded with a status:',
                    error.response.status
                );
                console.log('Error message:', error.response.data);
            } else {
                console.log(error.message);
            }
        });
});

// 비밀번호 확인
function validateForm() {
    var passwordInputField = document.getElementById('newpassword');
    var confirmPasswordInputField = document.getElementById(
        'newpassword-confirm'
    );

    var password = passwordInputField.value.trim();
    var confirmPassword = confirmPasswordInputField.value.trim();

    // 둘 다 비어있으면 통과
    if (!password && !confirmPassword) {
        return true;
    }

    // 하나만 채워져 있으면 경고
    if (password && !confirmPassword) {
        alert('비밀번호 확인을 입력해주세요.');
        return false;
    }

    if (!password && confirmPassword) {
        alert('비밀번호를 입력해주세요.');
        return false;
    }

    // 둘 다 채워져 있으면 일치하는지 검사
    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return false;
    }

    return true;
}
