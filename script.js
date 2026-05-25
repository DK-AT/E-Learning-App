let totalScore = 0;
const maxPoints = 15; // 3 quizy (3pkt) + 3 drag (3pkt) + 2 fill (2pkt) + 7 bonus za fiszki


// --- 1. Quiz Logic ---
const quizData = [
    {
        question: "Jakie słowo kluczowe używa się do zdefiniowania funkcji?",
        options: ["func", "fun", "function", "def"],
        correct: 1
    },
    {
        question: "Co zwraca funkcja, która nie ma zdefiniowanego typu zwracanego i nie używa return?",
        options: ["null", "Unit", "void", "undefined"],
        correct: 1
    },
    {
        question: "Jak wygląda funkcja jednolinijkowa (expression body)?",
        options: ["fun f() { return 1 }", "fun f() = 1", "fun f(): Int = 1", "fun f() -> 1"],
        correct: 1
    }
];

function renderQuiz() {
    const container = document.getElementById('quiz-container');
    quizData.forEach((q, index) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'question';
        qDiv.innerHTML = `<p><strong>${index + 1}. ${q.question}</strong></p>`;
        
        q.options.forEach((opt, optIndex) => {
            qDiv.innerHTML += `
                <label>
                    <input type="radio" name="q${index}" value="${optIndex}"> ${opt}
                </label>
            `;
        });
        container.appendChild(qDiv);
    });
}

document.getElementById('check-quiz-btn').addEventListener('click', () => {
    let score = 0;
    quizData.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && parseInt(selected.value) === q.correct) {
            score++;
        }
    });
    
    const resultBox = document.getElementById('quiz-result');
    resultBox.textContent = `Quiz: ${score}/${quizData.length} punktów`;
    resultBox.style.backgroundColor = score === quizData.length ? '#d4edda' : '#f8d7da';
    resultBox.classList.remove('hidden');
    
    window.quizScore = score;
});