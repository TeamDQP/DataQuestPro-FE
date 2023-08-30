const surveyListContainer = document.getElementById('surveyList');
const categoryFilter = document.getElementById('categoryFilter');

fetch(BaseUrl + '/surveys/survey/', {
    method: 'GET',
})
    .then(response => response.json())
    .then(data => {

        data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });

        data.surveys.forEach(survey => {
            const cardHtml = generateSurveyCard(survey);
            surveyListContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
        
    })
    .catch(error => console.error('Error fetching surveys:', error));

surveyListContainer.addEventListener('click', event => {
    if (event.target.classList.contains('delete-btn')) {
        const surveyId = event.target.getAttribute('data-id');
        if (confirm('설문조사를 삭제하시겠습니까?')) {
            fetch(BaseUrl + '/surveys/survey/delete/' + surveyId, {
                method: 'POST',
            })
                .then(response => response.json())
                .then(data => {
                    // 삭제 후 새로고침 또는 다른 조치
                    location.reload();
                })
                .catch(error => console.error('Error deleting survey:', error));
        }
    }
});
function generateSurveyCard(survey) {
    return `
        <div class="col-md-6">
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${survey.title}</h5>
                    <p class="card-text">${survey.intro}</p>
                    <p class="card-text">조회수: ${survey.views}</p>
                    <p class="card-text">작성자: ${survey.user}</p>
                    <p class="card-text">카테고리: ${survey.category}</p>
                    <p class="card-text">태그: ${survey.tags.join(', ')}</p>
                    
                    ${survey.is_done
                        ? '<a href="./other_link.html" class="btn btn-secondary">다른 링크</a>'
                        : `<a href="./survey_detail.html?id=${survey.id}" class="btn btn-primary">시작하기</a>`}
                    
                    <button class="btn btn-danger delete-btn" data-id="${survey.id}">삭제</button>
                    <a href="./survey_edit.html?id=${survey.id}" class="btn btn-secondary">수정</a>
                    <a href="./survey_result.html?id=${survey.id}" class="btn btn-secondary">결과</a>
                </div>
            </div>
        </div>
    `;
}
    // Function to filter surveys based on the selected category
function filterSurveysByCategory(categoryId) {
    surveyListContainer.innerHTML = ''; // Clear previous survey cards
    fetch(BaseUrl + '/surveys/survey/?category=' + categoryId, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            data.surveys.forEach(survey => {
                const cardHtml = generateSurveyCard(survey);
                surveyListContainer.insertAdjacentHTML('beforeend', cardHtml);
            });
        })
        .catch(error => console.error('Error fetching surveys:', error));
}

// Event listener for category selection
categoryFilter.addEventListener('change', event => {
    const selectedCategoryId = event.target.value;
    if (selectedCategoryId === '') {
        // Show all surveys if no category is selected
        filterSurveysByCategory(null);
    } else {
        filterSurveysByCategory(selectedCategoryId);
    }
});