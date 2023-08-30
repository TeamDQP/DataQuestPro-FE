import { isTokenValid } from './utils.js';

const startButton = document.getElementById('start-btn');

startButton.addEventListener('click', function () {
    const token = localStorage.getItem('token');

    isTokenValid(token)
        .then((isValid) => {
            if (isValid) {
                window.location.href = './html/survey_list.html';
            } else {
                window.location.href = './html/login.html';
            }
        })
        .catch((error) => {
            console.error(error);
            alert('An error occurred while validating the token.');
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
