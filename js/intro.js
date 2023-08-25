function goTologin() {
    location.href = '/login';
}

new fullpage('#fullpage', {
    atuoScrolling: true,
    scollHorizontally: true,
});

fullpage_api.setAllowScrolling(false);
