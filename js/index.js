const startButton = document.getElementById('start-btn');

startButton.addEventListener('click', function () {
    const token = localStorage.getItem('token');
    axios
        .get('http://127.0.0.1:8000/user/validate-jwt/', {
            headers: {
                Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
        })
        .then((response) => {
            // handle success
            window.location.href = './html/survey_list.html';
        })
        .catch((error) => {
            // handle error
            window.location.href = './html/login.html';
        });
});

window.addEventListener('wheel', function (e) {
    const mainContents = document.getElementById('main_contents');
    const subContents = document.getElementById('sub_contents');

    if (e.wheelDelta < 0 && window.scrollY < mainContents.offsetHeight) {
        e.preventDefault();
        window.scrollTo({
            top: mainContents.offsetHeight,
            behavior: 'smooth',
        });
    } else if (
        e.wheelDelta > 0 &&
        window.scrollY >= mainContents.offsetHeight
    ) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
});
