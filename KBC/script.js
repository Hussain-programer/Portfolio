const questions = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correct: 1,
    prize: "₹10,000",
  },
  {
    question: "Who is known as the Father of the Nation in India?",
    options: [
      "Bhagat Singh",
      "Jawaharlal Nehru",
      "Mahatma Gandhi",
      "Subhas Chandra Bose",
    ],
    correct: 2,
    prize: "₹20,000",
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Oxygen", "Gold", "Iron", "Osmium"],
    correct: 0,
    prize: "₹30,000",
  },
  {
    question: "Who wrote the Indian national anthem?",
    options: [
      "Bankim Chandra Chatterjee",
      "Rabindranath Tagore",
      "Sarojini Naidu",
      "Mahatma Gandhi",
    ],
    correct: 1,
    prize: "₹50,000",
  },
  {
    question: "Which is the largest continent in the world?",
    options: ["Africa", "Europe", "Asia", "Australia"],
    correct: 2,
    prize: "₹100,000",
  },
];

let currentQuestion = 0;
let timer;
let timeLeft = 30;
const prizePool = ["₹100,000", "₹50,000", "₹30,000", "₹20,000", "₹10,000"];

// Initialize game elements
const questionElement = document.querySelector(".question");
const optionsGrid = document.querySelector(".options-grid");
const timerElement = document.querySelector(".timer");
const prizePoolElement = document.querySelector(".prize-pool");
const modal = document.getElementById("startModal");
const startBtn = document.querySelector(".start-btn");

// Lifeline buttons
const fiftyFifty = document.getElementById("fifty-fifty");
const audiencePoll = document.getElementById("audience-poll");
const expertAdvice = document.getElementById("expert-advice");

// Quit game elements
const quitModal = document.getElementById("quitModal");
const quitBtn = document.getElementById("quitGame");
const currentWinningsSpan = document.getElementById("currentWinnings");

// Show start modal
modal.style.display = "flex";

// Initialize prize pool
function initializePrizePool() {
  prizePool.forEach((prize, index) => {
    const prizeLevel = document.createElement("div");
    prizeLevel.className = "prize-level";
    prizeLevel.textContent = prize;
    prizePoolElement.appendChild(prizeLevel);
  });
}

// Start game
startBtn.addEventListener("click", () => {
  modal.style.display = "none";
  startGame();
});

function startGame() {
  currentQuestion = 0;
  initializePrizePool();
  loadQuestion();
  startTimer();
}

function loadQuestion() {
  if (currentQuestion >= questions.length) {
    endGame(true);
    return;
  }

  const question = questions[currentQuestion];
  questionElement.textContent = question.question;
  optionsGrid.innerHTML = "";

  // Update prize pool highlight
  document.querySelectorAll(".prize-level").forEach((level, index) => {
    level.classList.toggle(
      "active",
      index === questions.length - 1 - currentQuestion
    );
  });

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    button.addEventListener("click", () => checkAnswer(index));
    optionsGrid.appendChild(button);
  });

  resetTimer();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame(false);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timerElement.textContent = timeLeft;
  startTimer();
}

function checkAnswer(selectedIndex) {
  clearInterval(timer);
  const options = document.querySelectorAll(".option");
  const correctIndex = questions[currentQuestion].correct;

  options[correctIndex].classList.add("correct");
  if (selectedIndex !== correctIndex) {
    options[selectedIndex].classList.add("wrong");
    setTimeout(() => endGame(false), 2000);
  } else {
    setTimeout(() => {
      currentQuestion++;
      loadQuestion();
    }, 2000);
  }
}

function endGame(won) {
  clearInterval(timer);
  const message = won
    ? `Congratulations! You've won ${questions[questions.length - 1].prize}!`
    : `Game Over! You won ${
        currentQuestion > 0 ? questions[currentQuestion - 1].prize : "₹0"
      }`;

  modal.querySelector("h2").textContent = message;
  modal.querySelector("p").textContent = "Would you like to play again?";
  modal.style.display = "flex";
}

// Lifeline functions
fiftyFifty.addEventListener("click", () => {
  fiftyFifty.disabled = true;
  const options = document.querySelectorAll(".option");
  const correctIndex = questions[currentQuestion].correct;
  let eliminated = 0;
  let availableIndices = [0, 1, 2, 3].filter((i) => i !== correctIndex);

  while (eliminated < 2) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const eliminateIndex = availableIndices[randomIndex];
    options[eliminateIndex].style.visibility = "hidden";
    availableIndices.splice(randomIndex, 1);
    eliminated++;
  }
});

audiencePoll.addEventListener("click", () => {
  audiencePoll.disabled = true;
  const correctIndex = questions[currentQuestion].correct;
  const options = document.querySelectorAll(".option");

  options.forEach((option, index) => {
    const percentage =
      index === correctIndex
        ? Math.floor(Math.random() * 30 + 70)
        : Math.floor(Math.random() * 20);
    option.textContent += ` (${percentage}%)`;
  });
});

expertAdvice.addEventListener("click", () => {
  expertAdvice.disabled = true;
  const correctIndex = questions[currentQuestion].correct;
  const options = document.querySelectorAll(".option");

  options[correctIndex].style.border = "3px solid var(--cyber-yellow)";
});
// Add event listeners for quit functionality
quitBtn.addEventListener("click", () => showQuitModal());

quitModal.querySelector(".continue-btn").addEventListener("click", () => {
  quitModal.style.display = "none";
  startTimer(); // Resume the timer
});

quitModal.querySelector(".quit-confirm-btn").addEventListener("click", () => {
  quitGame();
});

function showQuitModal() {
  clearInterval(timer); // Pause the timer
  const currentPrize = getCurrentWinnings();
  currentWinningsSpan.textContent = currentPrize;
  quitModal.style.display = "flex";
}

function quitGame() {
  const currentPrize = getCurrentWinnings();
  modal.querySelector("h2").textContent = `Thanks for playing!`;
  modal.querySelector(
    "p"
  ).textContent = `You're leaving with ${currentPrize}. Would you like to play again?`;
  quitModal.style.display = "none";
  modal.style.display = "flex";
  startGame(); // Reset the game
}

function getCurrentWinnings() {
  return currentQuestion > 0 ? questions[currentQuestion - 1].prize : "₹0";
}
