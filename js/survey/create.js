const surveyForm = document.getElementById('surveyForm');
const questionsContainer = document.getElementById('questionsContainer');
const addQuestionBtn = document.getElementById('addQuestionBtn');

let selectedTags = [];

let questionCounter = 1;

Sortable.create(questionsContainer, {
    animation: 150, // 드래그 애니메이션 지속 시간 (밀리초)
});
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

addQuestionBtn.addEventListener('click', () => {
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

    questionsContainer.appendChild(questionElement);

    let answerCounter = 1;

    const answersContainer = document.getElementById(`answers_${questionCounter}`);
    addAnswerBtn.addEventListener('click', () => {
        const currentQuestionCounter = questionCounter - 1; // 이전 질문의 questionCounter 값
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
    });
    addDeleteQuestionButton(questionElement);
    questionCounter++;
});

// 폼 제출 시 서버로 데이터 전송
// 폼 제출 이벤트 리스너
surveyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

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
            if (questionData.type === "scale" && answerInputs.length === 0) {
                alert(`Please answer the question: "${questionData.question_text}"`);
                return;
            }
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
            enddated_at: formData.get('enddated_at'),
            questions: questionsData,
            category: formData.get('category'), // 카테고리 추가
            tags: selectedTags, // 선택한 태그 추가
        };

        // 서버로 데이터 전송
        const response = await fetch(BaseUrl + '/surveys/survey/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            alert('설문조사 작성이 완료되었습니다.');
            
            window.location.href = './survey_list.html';
        } else {
            console.error('데이터 전송 실패:', response.status);
        }

    } catch (error) {
        console.error('Error creating survey:', error);
    }
});
document.addEventListener("DOMContentLoaded", function() {
    // 카테고리 데이터 가져오기
    fetch(BaseUrl + '/surveys/survey/create/', {
            headers: {
                Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
        })
        .then(response => response.json())
        .then(data => {
            const selectBox = document.getElementById('categorySelect'); // select 박스의 ID를 적절히 변경하세요
            
            // 카테고리 데이터를 옵션 요소로 추가
            data.forEach(function(category) {
                const option = document.createElement('option');
                option.value = category.id;
                option.text = category.name;
                selectBox.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));

// 태그 추가 버튼 클릭 시
    document.getElementById('addTagBtn').addEventListener('click', function() {
        const tagInput = document.getElementById('tagInput');
        let tag = tagInput.value.trim();

        if (tag) {
            // 이미 추가된 태그인지 확인
            if (!selectedTags.includes(tag)) {
                selectedTags.push(tag);
                updateSelectedTags();
            }

            tagInput.value = ''; // 입력 필드 비우기
        }
    });

    // 선택한 태그 업데이트 함수
    function updateSelectedTags() {
        const selectedTagsContainer = document.getElementById('selectedTags');
        selectedTagsContainer.innerHTML = '';

        selectedTags.forEach(function(tag) {
            const tagElement = document.createElement('span');
            tagElement.classList.add('badge', 'badge-primary', 'mr-2');
            tagElement.textContent = tag;

            selectedTagsContainer.appendChild(tagElement);
        });
    }
});