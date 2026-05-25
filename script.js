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

// --- 2. Drag & Drop Logic ---
const correctOrder = ['item1', 'item2', 'item3', 'item4', 'item5'];
let draggedItem = null;

const dropZone = document.getElementById('drop-zone');
const draggables = document.querySelectorAll('.draggable');

draggables.forEach(item => {
    item.addEventListener('dragstart', () => {
        draggedItem = item;
        setTimeout(() => item.classList.add('dragging'), 0);
    });
    
    item.addEventListener('dragend', () => {
        setTimeout(() => item.classList.remove('dragging'), 0);
        draggedItem = null;
    });
});

dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
    const afterElement = getDragAfterElement(dropZone, e.clientX);
    if (afterElement == null) {
        dropZone.appendChild(draggedItem);
    } else {
        dropZone.insertBefore(draggedItem, afterElement);
    }
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', () => {
    dropZone.classList.remove('drag-over');
});

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

document.getElementById('check-drag-btn').addEventListener('click', () => {
    const currentOrder = Array.from(dropZone.children).map(child => child.id);
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    
    const resultBox = document.getElementById('drag-result');
    if (isCorrect) {
        resultBox.textContent = "Świetnie! Kolejność poprawna. (+3 pkt)";
        resultBox.style.backgroundColor = '#d4edda';
        window.dragScore = 3;
    } else {
        resultBox.textContent = "Błąd. Spróbuj ponownie. (0 pkt)";
        resultBox.style.backgroundColor = '#f8d7da';
        window.dragScore = 0;
    }
    resultBox.classList.remove('hidden');
});
// --- 3. Fill in Blanks Logic ---
document.getElementById('check-fill-btn').addEventListener('click', () => {
    const val1 = document.getElementById('fill1').value.trim().toLowerCase();
    const val2 = document.getElementById('fill2').value.trim().toLowerCase();
    
    let score = 0;
    if (val1 === 'fun') score++;
    if (val2 === 'return') score++;
    
    const resultBox = document.getElementById('fill-result');
    resultBox.textContent = `Uzupełnianie: ${score}/2 punktów`;
    resultBox.style.backgroundColor = score === 2 ? '#d4edda' : '#f8d7da';
    resultBox.classList.remove('hidden');
    window.fillScore = score;
});

// --- 4. Flashcards Logic ---
function flipCard(card) {
    card.classList.toggle('flipped');
    // Prosta logika: jeśli użytkownik odwrócił wszystkie 3, daje punkty
    const flippedCount = document.querySelectorAll('.flashcard.flipped').length;
    if (flippedCount === 3) {
        window.flashcardScore = 3;
    } else {
        window.flashcardScore = 0;
    }
}

// --- 5. Podsumowanie i Ocena ---
document.getElementById('calculate-grade-btn').addEventListener('click', () => {
    // Pobieranie wyników (domyślnie 0 jeśli nie sprawdzono)
    const qScore = window.quizScore || 0;
    const dScore = window.dragScore || 0;
    const fScore = window.fillScore || 0;
    const fcScore = window.flashcardScore || 0;
    
    const currentTotal = qScore + dScore + fScore + fcScore;
    const maxTotal = 11; // 3 + 3 + 2 + 3
    
    document.getElementById('total-points').textContent = currentTotal;
    document.getElementById('max-points').textContent = maxTotal;
    
    const percentage = (currentTotal / maxTotal) * 100;
    let grade = "";
    let gradeColor = "";

    if (percentage <= 50) {
        grade = "2.0 (Niedostateczny)";
        gradeColor = "#f44336";
    } else if (percentage <= 60) {
        grade = "3.0 (Dostateczny)";
        gradeColor = "#ff9800";
    } else if (percentage <= 70) {
        grade = "3.5 (Dostateczny plus)";
        gradeColor = "#ffc107";
    } else if (percentage <= 80) {
        grade = "4.0 (Dobry)";
        gradeColor = "#8bc34a";
    } else if (percentage <= 90) {
        grade = "4.5 (Dobry plus)";
        gradeColor = "#4caf50";
    } else {
        grade = "5.0 (Bardzo dobry)";
        gradeColor = "#2e7d32";
    }

    const gradeDisplay = document.getElementById('grade-display');
    gradeDisplay.textContent = grade;
    gradeDisplay.style.color = gradeColor;
});

// Inicjalizacja
renderQuiz();