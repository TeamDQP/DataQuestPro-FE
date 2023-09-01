const logoutbtn = document.querySelector(".logout-btn");

logoutbtn.addEventListener("click", (event) => {
    event.preventDefault();

    fetch(BaseUrl + "/user/logout/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            refresh: localStorage.getItem("refresh"),
        }),
    })
        .then((response) => {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");

            window.location.href = "./login.html";
        })
        .catch((error) => {
            console.error("Error:", error);

            alert(`로그아웃 실패: ${error.message}`);
        });
});