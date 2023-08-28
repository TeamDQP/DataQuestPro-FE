function goTologin() {
    location.href = '/login.html';
}

new fullpage('#fullpage', {
    atuoScrolling: true,
    scollHorizontally: true,
});

fullpage_api.setAllowScrolling(false);
