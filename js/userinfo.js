const token = localStorage.getItem('token');

function getUserinfo() {
    axios
        .get('http://localhost:8000/user/update/', {
            headers: {
                Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
        })
        .then((response) => {
            // response 로 받아온 username과 profileimage를 저장
            const name = response.data.name;
            const email = response.data.email;
            const email_opt_in = response.data.email_opt_in;

            console.log(name);
            console.log(email);
            console.log(email_opt_in);
            document.getElementById('name').innerText = name;
            document.getElementById('email').innerText = email;
            document.getElementById('email_opt_in').innerText = email_opt_in;

            if (email_opt_in) {
                document.getElementById('email_opt_in').innerText =
                    '수신 동의함';
            } else {
                document.getElementById('email_opt_in').innerText =
                    '수신 거부함';
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
