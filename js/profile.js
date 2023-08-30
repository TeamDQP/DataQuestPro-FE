const token = localStorage.getItem('token');

function getProfile() {
    axios.get('http://localhost:8000/user/profile/read/', {
        headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request headers
        },
    })
    .then(response => {
        // response 로 받아온 username과 profileimage를 저장
        console.log(response)
        const username = response.data.username
        const profileimage = response.data.profileimage

        console.log(username)
        console.log(profileimage)

        // 이미지 요소 생성하여 가져온 profileimage 주소 넣어줌
        const imgItem = document.createElement("img");
        imgItem.classList.add("thumbnail");
        imgItem.setAttribute("alt", "image unavailable");
        imgItem.setAttribute(
        "src",
        `http://127.0.0.1:8000${profileimage}`
    );
    const image = document.querySelector(".mini1")
    image.append(imgItem);

    // 위와 같은 방법으로 element 생성하셔서 username 을 원하시는 html element 안에 넣으시면 됩니다.
        const nickname = document.querySelector('.nickname').innerHTML=  `${username}`;
    })
    .catch(error => {
        console.log(error)
    })
}



// function editImg() {
//     const token = localStorage.getItem('token');
//     axios.get('http://localhost:8000/user/profile/update/', {
//         headers: {
//             Authorization: `Bearer ${token}`, // Add the token to the request headers
//         },
//     })
//     .then(response => {
//         // response 로 받아온 username과 profileimage를 저장
//         const username = response.data.username
//         const profileimage = response.data.profileimage

//         console.log(username)
//         console.log(profileimage)

//         // 이미지 요소 생성하여 가져온 profileimage 주소 넣어줌
//         const imgItem = document.createElement("img");
//         imgItem.classList.add("thumbnail");
//         imgItem.setAttribute("alt", "image unavailable");
//         imgItem.setAttribute(
//         "src",
//         `http://127.0.0.1:8000${profileimage}`
//     );
//     const image = document.querySelector(".mini1")
//     image.append(imgItem);

//     // 위와 같은 방법으로 element 생성하셔서 username 을 원하시는 html element 안에 넣으시면 됩니다.

//     })
//     .catch(error => {
//         console.log(error)
//     })
// }