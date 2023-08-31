const BaseUrl = 'http://15.164.56.233/api';
const token = localStorage.getItem('token');

function getUserinfo() {
    axios
        .get(BaseUrl + '/user/update/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            const name = response.data.name;
            const email = response.data.email;
            const email_opt_in = response.data.email_opt_in;

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
