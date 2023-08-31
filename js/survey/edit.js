const surveyForm = document.getElementById('surveyForm');
const questionsContainer = document.getElementById('questionsContainer');
const addQuestionBtn = document.getElementById('addQuestionBtn');
const addTagBtn = document.getElementById('addTagBtn');
const tagInput = document.getElementById('tagInput');
const selectedTagsContainer = document.getElementById('selectedTags');

let questionCounter = 0;
let selectedTags = [];

Sortable.create(questionsContainer, {
    animation: 150, // 드래그 애니메이션 지속 시간 (밀리초)
});

function fetchJSON(url) {
    return fetch(url).then(response => response.json());
}

function createQuestionElement(questionCounter) {
    const questionHtml = `
        <div class="question">
            <div class="form-group">
                <label for="question_text">질문 내용</label>
                <textarea class="form-control question_text" id="question_text" name="question_text" rows="2" required></textarea>
            </div>
            <div class="form-group">
                <label for="question_type">질문 유형</label>
                <select class="form-control question_type" id="question_type" name="question_type" required>
                    <option value="scale">객관식</option>
                    <option value="open">서술형</option>
                </select>
            </div>
            <div class="form-check">
                <input type="checkbox" class="form-check-input required" id="required" name="required">
                <label class="form-check-label" for="required">필수</label>
            </div>
            <div id="answers_${questionCounter}">
                <!-- 추가된 답변 필드가 여기에 동적으로 추가될 것입니다. -->
            </div>
        </div>
    `;
    const questionElement = document.createElement('div');
    questionElement.innerHTML = questionHtml;

    const addAnswerBtn = document.createElement('button');
    addAnswerBtn.innerHTML = '답변 추가';
    addAnswerBtn.className = 'btn btn-sm btn-secondary mt-2';
    questionElement.appendChild(addAnswerBtn);

    const answersContainer = document.getElementById(`answers_${questionCounter}`);
    let answerCounter = 1;

    addAnswerBtn.addEventListener('click', () => {
        handleAddAnswerClick(questionCounter, answerCounter);
    });

    return questionElement;
}

function updateSelectedTags() {
    var selectedTagsContainer = document.getElementById('selectedTags');
    selectedTagsContainer.innerHTML = '';

    selectedTags.forEach(function(tag) {
        var tagElement = document.createElement('span');
        tagElement.classList.add('badge', 'badge-primary', 'mr-2');
        tagElement.textContent = tag;

        selectedTagsContainer.appendChild(tagElement);
    });
}

async function fetchSurveyDetails() {
    try {
        const response = await fetch(`${BaseUrl}/surveys/survey/update/${surveyId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
        });
        const surveyData = await response.json();
        const titleInput = document.getElementById('title');
        const introTextarea = document.getElementById('intro');
        const categorySelect = document.getElementById('categorySelect');

        titleInput.value = surveyData.survey.title;
        introTextarea.value = surveyData.survey.intro;

        surveyData.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            if (category.id === surveyData.survey.category) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });
        surveyData.tags.forEach(tag =>{
            selectedTags.push(tag.name);
            updateSelectedTags();
        })
        // Render survey details

        surveyData.questions.forEach((question, index) => {
            const questionElement = createQuestionElement(index);
            // Set question text, type, and required
            const questionTextElement = questionElement.querySelector('.question_text');
            questionTextElement.value = question.question_text;

            const questionTypeElement = questionElement.querySelector('.question_type');
            questionTypeElement.value = question.type;

            const requiredCheckbox = questionElement.querySelector('.required');
            requiredCheckbox.checked = question.is_required;

            // Append answer options
            const answersContainer = questionElement.querySelector(`#answers_${index}`);
            question.answer_options.forEach((answer, answerIndex) => {
                const answerHtml = `
                    <div class="form-group">
                        <label for="answer_${index}_${answerIndex}">답변 내용</label>
                        <input type="text" class="form-control answers" id="answer_${index}_${answerIndex}" name="answer_${index}_${answerIndex}" value="${answer}" required>
                    </div>
                `;
                const answerElement = document.createElement('div');
                answerElement.innerHTML = answerHtml;
                answersContainer.appendChild(answerElement);
                addDeleteAnswerButton(answerElement, questionCounter);
            });

            questionCounter = index + 1;

            // Append the entire question element to the surveyQuestionsContainer
            addDeleteQuestionButton(questionElement);
            questionsContainer.appendChild(questionElement);
        });

    } catch (error) {
        console.error('Error fetching survey details:', error);
    }
}

function addDeleteQuestionButton(questionElement) {
    const deleteQuestionBtn = document.createElement('button');
    deleteQuestionBtn.innerHTML = '질문 삭제';
    deleteQuestionBtn.className = 'btn btn-sm btn-danger mt-2';
    questionElement.appendChild(deleteQuestionBtn);

    deleteQuestionBtn.addEventListener('click', () => {
        questionsContainer.removeChild(questionElement);
    });
}

function addDeleteAnswerButton(answerElement, questionCounter) {
    const deleteAnswerBtn = document.createElement('button');
    deleteAnswerBtn.innerHTML = '답변 삭제';
    deleteAnswerBtn.className = 'btn btn-sm btn-danger ml-2';
    answerElement.appendChild(deleteAnswerBtn);

    deleteAnswerBtn.addEventListener('click', () => {
        const answersContainer = document.getElementById(`answers_${questionCounter}`);
        answersContainer.removeChild(answerElement);
    });
}

function handleAddAnswerClick(questionCounter, answerCounter) {
    const currentQuestionCounter = questionCounter; // 이전 질문의 questionCounter 값
    const currentAnswersContainer = document.getElementById(`answers_${currentQuestionCounter}`);

    if (currentAnswersContainer) {
        const answerHtml = `
            <div class="form-group">
                <label for="answer_${currentQuestionCounter}_${answerCounter}">답변 내용</label>
                <input type="text" class="form-control answers" id="answer" name="answer" required>
            </div>
        `;

        const answerElement = document.createElement('div');
        answerElement.innerHTML = answerHtml;
        currentAnswersContainer.appendChild(answerElement);

        addDeleteAnswerButton(answerElement, currentQuestionCounter);
        answerCounter++;
    }
}

function handleAddQuestionClick() {
    const questionElement = createQuestionElement(questionCounter);
    questionsContainer.appendChild(questionElement);

    addDeleteQuestionButton(questionElement);
    questionCounter++;
}

async function handleFormSubmit(event) {
    try {
        // 질문 컨테이너 내의 질문 요소들을 선택
        const sortedQuestionElements = questionsContainer.querySelectorAll('.question');
        const questionsData = [];

        // 질문 데이터 수집
        sortedQuestionElements.forEach((questionElement, index) => {
            const questionData = {
                question_text: questionElement.querySelector('.question_text').value,
                type: questionElement.querySelector('.question_type').value,
                is_required: questionElement.querySelector('.required').checked,
                qnum:index,
                answers: [],
            };

            // 답변 데이터 수집
            const answerInputs = questionElement.querySelectorAll('.answers');
            answerInputs.forEach(answerInput => {
                questionData.answers.push(answerInput.value);
            });

            questionsData.push(questionData);
        });

        // 폼 데이터 수집
        const formData = new FormData(surveyForm);
        
        // 포스트 데이터 생성
        const postData = {
            title: formData.get('title'),
            intro: formData.get('intro'),
            is_done: formData.get('is_done'),
            questions: questionsData,
            category: formData.get('category'), // 카테고리 추가
            tags: selectedTags, // 선택한 태그 추가
        };
        // 서버로 데이터 전송
        try {
            const response = await fetch(BaseUrl + `/surveys/survey/update/${surveyId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();
            if (response.ok) {
                alert('설문조사 작성이 완료되었습니다.');
                
                window.location.href = './survey_list.html';
            } else {
                console.error('데이터 전송 실패:', response.status);
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
        // 생성 완료 시 처리 로직 추가


    } catch (error) {
        console.error('Error creating survey:', error);
    }
}

function handleAddTagClick() {
    var tagInput = document.getElementById('tagInput');
    var tag = tagInput.value.trim();

    if (tag) {
        // 이미 추가된 태그인지 확인
        if (!selectedTags.includes(tag)) {
            selectedTags.push(tag);
            updateSelectedTags();
        }

        tagInput.value = ''; // 입력 필드 비우기
    }
}

// Attach event listeners
addQuestionBtn.addEventListener('click', () => {
    handleAddQuestionClick()
});
surveyForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    handleFormSubmit(event)
});
addTagBtn.addEventListener('click', () => {
    handleAddTagClick()
});

// Fetch survey details on page load
fetchSurveyDetails();