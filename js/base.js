// survey_list.html 내용을 비동기 방식으로 가져와서 content 영역에 삽입
fetch('survey_list.html')
    .then((response) => response.text())
    .then((html) => {
        document.getElementById('content').innerHTML = html;
    })
    .catch((err) => {
        console.warn('Something went wrong.', err);
    });
