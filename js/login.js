const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    axios.post('http://127.0.0.1:8000/user/login/', {
        email: email,
        password: password,
    })
    .then(response => {
        console.log(response)
        const token = localStorage.setItem('token', response.data.access)
        // window.location.href = '/survey_list.html';
    })
    .catch(error => {
        console.log(error)
        alert('아이디나 비밀번호가 일치하지 않습니다.');
    })

});