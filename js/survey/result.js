const linkElement = document.querySelector('.btn-primary');
const linkHref = linkElement.getAttribute('href');

// 링크의 href 속성 업데이트
linkElement.setAttribute('href', linkHref + '?id=' + idParam);

const surveyResultDiv = document.getElementById('surveyResult');

fetch(`${BaseUrl}/surveys/survey/result/${surveyId}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request headers
        },
    })
    .then(response => response.json()) // 응답 데이터를 JSON 형태로 파싱합니다.
    .then(data => {
        // Organize the data into a dictionary with questions as keys and arrays of answer counts as values
        const questionData = {};
        data.forEach(item => {
            const questionText = item.question_text;
            const answerText = item.answer_text;
            const count = item.count;
            
            if (!questionData[questionText]) {
                questionData[questionText] = [];
            }
            
            if (count !== undefined) {
                questionData[questionText].push({ answerText, count });
            } else {
                questionData[questionText].push({ answerText });
            }
        });

        // Loop through the questionData dictionary and create a chart for each question
        for (const questionText in questionData) {
            const questionChartCanvas = document.createElement('canvas');
            const questionChartDiv = document.createElement('div');

            questionChartCanvas.className = 'mb-3';
            questionChartDiv.className = 'mb-3';

            questionChartDiv.appendChild(questionChartCanvas);
            surveyResultDiv.appendChild(questionChartDiv);

            const answerCounts = questionData[questionText];
            const labels = answerCounts.map(item => item.answerText);
            if (answerCounts[0].count !== undefined) {
                const counts = answerCounts.map(item => item.count);

                const questionChart = new Chart(questionChartCanvas, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: '답변 카운트',
                            data: counts,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                // 차트 위에 질문 텍스트를 제목으로 추가합니다.
                const chartTitle = document.createElement('h3');
                chartTitle.textContent = `질문: ${questionText}`;
                questionChartDiv.insertBefore(chartTitle, questionChartCanvas);
            } else {
                questionChartDiv.removeChild(questionChartCanvas);

                const answerTextList = document.createElement('ul');
                answerCounts.forEach(item => {
                    const answerTextItem = document.createElement('li');
                    answerTextItem.textContent = item.answerText;
                    answerTextList.appendChild(answerTextItem);
                });
                const Title = document.createElement('h3');
                Title.textContent = `질문: ${questionText}`;
                questionChartDiv.appendChild(Title);
                questionChartDiv.appendChild(answerTextList);
            }
        }

    })
    .catch(error => {
        console.error('Error:', error);
        surveyResultDiv.innerHTML = 'An error occurred while fetching data.';
    });