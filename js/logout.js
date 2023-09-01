const signupButton = document.querySelector(".logout-btn");

signupButton.addEventListener("click", function () {
    const token = localStorage.getItem("token");
    axios
        .get(BaseUrl + "/user/logout/", {
            headers: {
                Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
        })
        .then((response) => {
            // handle success
            window.location.href = "../index.html";
        })
        .catch((error) => {
            // handle error
            alert(`로그아웃 실패: ${error.message}`);
        });
});
