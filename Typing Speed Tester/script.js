const quotes = [
    "In 2050, quantum neural networks process thoughts at the speed of light, transforming consciousness into pure data.",
    "Holographic interfaces dance through augmented reality, painting digital dreams across the neon-stained sky.",
    "Synthetic DNA computers merge with biological systems, creating hybrid intelligence beyond human comprehension.",
    "The digital consciousness streams through quantum networks, transcending the boundaries of space and time.",
    "Neural implants synchronize with the global matrix, allowing instant access to the collective digital consciousness.",
    "Cybernetic enhancements blur the line between human and machine, creating a new species of digital beings.",
    "The quantum internet connects minds across dimensions, sharing thoughts at faster-than-light speeds.",
    "Artificial synapses fire in perfect harmony with biological neurons, creating a symphony of hybrid intelligence.",
    "Time becomes fluid in the digital realm, where nanoseconds stretch into eternities of processed thought.",
    "The city's neural network pulses with the combined consciousness of millions of interconnected minds."
];

let currentQuote = '';
let currentIndex = 0;
let startTime = null;
let timerInterval = null;
let timeLeft = 60;
let mistakes = 0;

const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timeDisplay = document.getElementById('time');
const restartBtn = document.getElementById('restart-btn');

function initializeGame() {
    currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
    currentIndex = 0;
    mistakes = 0;
    timeLeft = 60;
    startTime = null;
    updateDisplay();
    inputField.value = '';
    inputField.disabled = false;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    timeDisplay.textContent = timeLeft;
    clearInterval(timerInterval);
}

function updateDisplay() {
    textDisplay.innerHTML = currentQuote.split('').map((char, index) => {
        let className = '';
        if (index < currentIndex) {
            className = inputField.value[index] === char ? 'correct' : 'incorrect';
        } else if (index === currentIndex) {
            className = 'current';
        }
        return `<span class="${className}">${char}</span>`;
    }).join('');
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function calculateWPM() {
    const words = inputField.value.length / 5;
    const minutes = (60 - timeLeft) / 60;
    return Math.round(words / minutes);
}

function calculateAccuracy() {
    return Math.round(((currentIndex - mistakes) / currentIndex) * 100);
}

function endGame() {
    clearInterval(timerInterval);
    inputField.disabled = true;
}

inputField.addEventListener('input', () => {
    if (!startTime) {
        startTime = new Date();
        startTimer();
    }

    if (inputField.value[currentIndex] === currentQuote[currentIndex]) {
        currentIndex++;
    } else {
        mistakes++;
    }

    if (currentIndex === currentQuote.length) {
        currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
        currentIndex = 0;
        inputField.value = '';
    }

    updateDisplay();
    wpmDisplay.textContent = calculateWPM();
    accuracyDisplay.textContent = calculateAccuracy() + '%';
});

restartBtn.addEventListener('click', initializeGame);

initializeGame();