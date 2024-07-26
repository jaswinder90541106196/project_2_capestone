document.addEventListener('DOMContentLoaded', () => {
    const difficultyForm = document.getElementById('difficulty-form');
    const quizContainer = document.getElementById('quiz-container');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const submitAnswerButton = document.getElementById('submit-answer');
    const resultElement = document.getElementById('result');
    const correctCountElement = document.getElementById('correct-count');
    const incorrectCountElement = document.getElementById('incorrect-count');
    const resetScoreButton = document.getElementById('reset-score');
    const finalScoreContainer = document.getElementById('final-score-container');
    const finalCorrectCountElement = document.getElementById('final-correct-count');
    const finalIncorrectCountElement = document.getElementById('final-incorrect-count');
    const restartQuizButton = document.getElementById('restart-quiz');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const navLinks = document.querySelectorAll('nav a');
    const pages = document.querySelectorAll('.page');
    const contactForm = document.getElementById('contact-form');

    let questions = [];
    let currentQuestionIndex = 0;
    let correctCount = parseInt(localStorage.getItem('correctCount')) || 0;
    let incorrectCount = parseInt(localStorage.getItem('incorrectCount')) || 0;

    const updateScoreDisplay = () => {
        correctCountElement.textContent = correctCount;
        incorrectCountElement.textContent = incorrectCount;
    };

    updateScoreDisplay();

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    difficultyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const difficulty = document.getElementById('difficulty').value;

        try {
            const response = await fetch(`https://quizapi.io/api/v1/questions?apiKey=Nufjc9Vwnjtj5YkO6BVMi5RenS761OTfV7A5lHiD&difficulty=${difficulty}&limit=10`);
            questions = await response.json();
            if (questions.length > 0) {
                startQuiz();
            } else {
                alert('No questions available for the selected difficulty.');
            }
        } catch (error) {
            console.error('Error fetching quiz data:', error);
        }
    });

    const startQuiz = () => {
        currentQuestionIndex = 0;
        totalQuestionsElement.textContent = questions.length;
        displayQuestion();
        quizContainer.classList.remove('hidden');
        difficultyForm.classList.add('hidden');
        finalScoreContainer.classList.add('hidden');
        resultElement.textContent = '';
    };

    const displayQuestion = () => {
        const questionData = questions[currentQuestionIndex];
        questionElement.textContent = questionData.question;

        answersElement.innerHTML = '';
        Object.entries(questionData.answers).forEach(([key, answer]) => {
            if (answer) {
                const button = document.createElement('button');
                button.textContent = answer;
                button.dataset.correct = questionData.correct_answers[`${key}_correct`] === 'true';
                button.addEventListener('click', () => selectAnswer(button));
                answersElement.appendChild(button);
            }
        });

        currentQuestionElement.textContent = currentQuestionIndex + 1;
        submitAnswerButton.classList.remove('hidden');
        resultElement.textContent = '';
    };

    const selectAnswer = (selectedButton) => {
        const buttons = answersElement.querySelectorAll('button');
        buttons.forEach(button => {
            button.classList.remove('selected');
            button.disabled = true;
        });
        selectedButton.classList.add('selected');
        selectedButton.disabled = false;
    };

    submitAnswerButton.addEventListener('click', () => {
        const selectedButton = answersElement.querySelector('.selected');
        if (selectedButton) {
            if (selectedButton.dataset.correct === 'true') {
                resultElement.textContent = 'Correct!';
                correctCount++;
            } else {
                resultElement.textContent = 'Incorrect!';
                incorrectCount++;
            }
            localStorage.setItem('correctCount', correctCount);
            localStorage.setItem('incorrectCount', incorrectCount);
            updateScoreDisplay();
            submitAnswerButton.classList.add('hidden');

            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                setTimeout(displayQuestion, 1000);
            } else {
                setTimeout(showFinalScore, 1000);
            }
        } else {
            alert('Please select an answer.');
        }
    });

    const showFinalScore = () => {
        quizContainer.classList.add('hidden');
        finalScoreContainer.classList.remove('hidden');
        finalCorrectCountElement.textContent = correctCount;
        finalIncorrectCountElement.textContent = incorrectCount;
    };

    resetScoreButton.addEventListener('click', () => {
        correctCount = 0;
        incorrectCount = 0;
        localStorage.setItem('correctCount', correctCount);
        localStorage.setItem('incorrectCount', incorrectCount);
        updateScoreDisplay();
    });

    restartQuizButton.addEventListener('click', () => {
        correctCount = 0;
        incorrectCount = 0;
        localStorage.setItem('correctCount', correctCount);
        localStorage.setItem('incorrectCount', incorrectCount);
        updateScoreDisplay();
        difficultyForm.classList.remove('hidden');
        finalScoreContainer.classList.add('hidden');
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
});