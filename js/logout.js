const logoutbtn = document.querySelector(".logoutbtn");

logoutbtn.addEventListener("click", (event) => {
    event.preventDefault();

    fetch(BaseUrl + "/user/logout/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            refresh: localStorage.getItem("refreshToken"),
        }),
    })
        .then((response) => {
            if (!response.ok) throw new Error(response.status);

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");

            window.location.href = "./login.html";
        })
        .catch((error) => {
            console.error("Error:", error);

            alert(`로그아웃 실패: ${error.message}`);
        });
});

// logoutbtn.addEventListener("click", function () {
//     const token = localStorage.getItem("token");
//     axios
//         .post(BaseUrl + "/user/logout/", {
//             headers: {
//                 Authorization: `Bearer ${token}`, // Add the token to the request headers
//             },
//         })
//         .then((response) => {
//             // handle success
//             window.location.href = "../index.html";
//         })
//         .catch((error) => {
//             // handle error
//             alert(`로그아웃 실패: ${error.message}`);
//         });
// });
