const answerFormContainer = document.getElementById('answerForm');  // 이 부분 추가

async function fetchSurveyDetails() {
    try {
        const response = await fetch(`${BaseUrl}/surveys/survey/detail/${surveyId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
        });
        const surveyData = await response.json();

        // Render survey details
        const surveyHtml = `
            <div class="survey-header">
                <h2 class="survey-title">${surveyData.survey.title}</h2>
                <p class="survey-intro">설문조사 소개</p>
                <p class="survey-intro-text">${surveyData.survey.intro}</p>
                <p class="survey-category">${surveyData.category}</p>
                <div>
                    ${surveyData.tags.map(tag => `
                        <span class="badge badge-primary mr-2">${tag.name}</span>
                    `).join('')}
                </div>
            </div>
            <h3>질문 목록</h3>
            <ul>
                ${surveyData.questions.map(question => `
                    <li>
                        <div class="question-box">
                            <p>${question.question_text}</p>
                            <p>유형: ${question.type}</p>
                            <p>필수: ${question.is_required ? '필수' : '선택'}</p>
                            <div>
                                ${
                                    question.type === 'scale'
                                        ? question.answer_options.map((answer, index) => `
                                            <input type="radio" id="question${question.id}_${index}" name="question${question.id}" value="${answer}" ${question.is_required ? 'required' : ''} ${question.user_answer_text === answer ? 'checked' : ''}>
                                            <label for="question${question.id}_${index}">${answer}</label>
                                            <br>
                                        `).join('')
                                        : question.type === 'open'
                                        ? `<textarea class="answer-textarea" name="question${question.id}" ${question.is_required ? 'required' : ''}>${question.user_answer_text}</textarea>`
                                        : ''
                                }
                            </div>
                        </div>
                    </li>
                `).join('')}
            </ul>
            <button type="submit">답변 제출</button>
        `;

        answerFormContainer.innerHTML = surveyHtml;
    } catch (error) {
        console.error('Error fetching survey details:', error);
    }
}

fetchSurveyDetails();

answerFormContainer.addEventListener('click', async function(event) {
    if (event.target.tagName === 'BUTTON' && event.target.getAttribute('type') === 'submit') {
        const selectedAnswers = [];

        const questionInputs = answerFormContainer.querySelectorAll('input[type="radio"]');
        const textareas = answerFormContainer.querySelectorAll('textarea');

        // 필수 라디오 버튼 및 텍스트 영역 체크
        let inputsAreValid = true;
        const radioGroups = {}; // 그룹화된 라디오 버튼을 저장할 객체

        questionInputs.forEach(input => {
            const groupName = input.name;

            // 라디오 버튼 그룹이 없다면 초기화
            if (!radioGroups[groupName]) {
                radioGroups[groupName] = [];
            }

            radioGroups[groupName].push(input);
        });

        // 라디오 버튼 그룹 별로 검사
        for (const groupName in radioGroups) {
            const group = radioGroups[groupName];
            let isGroupChecked = false;

            group.forEach(input => {
                if (input.checked) {
                    isGroupChecked = true;
                }
            });

            if (!isGroupChecked) {
                const questionText = group[0].closest('.question-box').querySelector('p').textContent;
                alert(`Please answer the question: "${questionText}"`);
                inputsAreValid = false;
            }
        }
        questionInputs.forEach(input => {
            const questionId = input.name.replace('question', '');
            const answerValue = input.value;

            if (input.checked) {
                selectedAnswers.push({ question_id: questionId, answer_text: answerValue });
            }
        });

        textareas.forEach(textarea => {
            const questionId = textarea.name.replace('question', '');
            const answerValue = textarea.value;
            const questionText = textarea.closest('.question-box').querySelector('p').textContent;

            if (textarea.required && !answerValue.trim()) {
                alert(`Please answer the question: "${questionText}"`);
                inputsAreValid = false;
            } else {
                selectedAnswers.push({ question_id: questionId, answer_text: answerValue });
            }
        });

        if (!inputsAreValid) {
            return;
        }

        try {
            const response = await fetch(`${BaseUrl}/surveys/survey/submit/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    survey_id: surveyId,
                    answers: selectedAnswers,
                }),
            });

            const responseData = await response.json();
            if (response.ok) {
                alert('설문조사 작성이 완료되었습니다.');
                
                window.location.href = './survey_list.html';
            } else {
                console.error('데이터 전송 실패:', response.status);
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    }
});