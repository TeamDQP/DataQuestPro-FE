const BaseUrl = "http://15.164.56.233";
const token = localStorage.getItem("token");

const imgForm = document.getElementById("profile-img-form");
imgForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    // Get form data
    const formData = new FormData(imgForm);
    console.log(formData);
    // formData.append('profileimage','')
    // Make API call using Axios
    axios
        .post(BaseUrl + "/user/profile/update/", formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
        })
        .then((response) => {
            console.log(response);
            window.location.href = "./profilepage.html";
        })
        .catch((error) => {
            console.log(error);
        });
});

function getProfile() {
    axios
        .get(BaseUrl + "/user/profile/update/", {
            headers: {
                Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
        })
        .then((response) => {
            // response 로 받아온 username과 profileimage를 저장
            console.log(response);
            const username = response.data.username;
            const profileimage = response.data.profileimage;

            console.log(username);
            console.log(profileimage);

            const imgItem = document.createElement("img");
            imgItem.classList.add("thumbnail");
            imgItem.setAttribute("alt", "image unavailable");
            imgItem.setAttribute("src", `${BaseUrl}${profileimage}`);
            const image = document.querySelector(".display-img");
            image.append(imgItem);

            // document.getElementById('image').src = `http://127.0.0.1:8000${profileimage}`;
            document.getElementById("username").value = username;

            //     // 이미지 요소 생성하여 가져온 profileimage 주소 넣어줌
            //     const imgItem = document.createElement("img");
            //     imgItem.classList.add("thumbnail");
            //     imgItem.setAttribute("alt", "image unavailable");
            //     imgItem.setAttribute(
            //     "src",
            //     `http://127.0.0.1:8000${profileimage}`
            // );
            // const image = document.querySelector(".mini1")
            // image.append(imgItem);

            // 위와 같은 방법으로 element 생성하셔서 username 을 원하시는 html element 안에 넣으시면 됩니다.
            // const nickname = document.querySelector('.nickname').innerHTML=  `${username}`;
        })
        .catch((error) => {
            console.log(error);
        });
}
