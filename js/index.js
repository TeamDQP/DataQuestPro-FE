const BaseUrl = 'http://15.164.56.233';

const startButton = document.getElementById('start-btn');

startButton.addEventListener('click', function () {
    const token = localStorage.getItem('token');
    axios.get(BaseUrl + '/user/validate-jwt/', {
        headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request headers
        },
    })
    .then(response => {
        // handle success
        window.location.href = './html/survey_list.html';
    })
    .catch(error => {
        // handle error
        window.location.href = './html/login.html';
    })
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
