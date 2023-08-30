const currentUrl = window.location.href;

// URL 파라미터 추출 함수
function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(currentUrl);
    
    if (!results) return null;
    if (!results[2]) return '';
    
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// 'id' 파라미터 값 가져오기
const idParam = getParameterByName('id');

const BaseUrl = 'http://127.0.0.1:8000';
const surveyId = idParam;