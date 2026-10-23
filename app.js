const QUESTIONS = [
  { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], answer: 1 },
  { q: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: 2 },
  { q: "Who wrote the Harry Potter books?", options: ["J.R.R. Tolkien", "Suzanne Collins", "J.K. Rowling", "Rick Riordan"], answer: 2 },
  { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
  { q: "Which animal is the fastest on land?", options: ["Cheetah", "Lion", "Horse", "Greyhound"], answer: 0 },
  { q: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer: 2 }
];

let current = 0, score = 0, answered = false;

const $ = id => document.getElementById(id);

function show(view) {
  ["home-view", "quiz-view", "results-view"].forEach(v => $(v).hidden = v !== view);
}

function startQuiz() {
  current = 0; score = 0;
  $("score-pill").textContent = "Score: 0";
  show("quiz-view");
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const item = QUESTIONS[current];
  $("question").textContent = item.q;
  $("q-count").textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
  $("progress-fill").style.width = `${(current / QUESTIONS.length) * 100}%`;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("btn-next").hidden = true;

  const box = $("options");
  box.innerHTML = "";
  item.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;
    btn.onclick = () => pick(i, btn);
    box.appendChild(btn);
  });
}

function pick(i, btn) {
  if (answered) return;
  answered = true;
  const item = QUESTIONS[current];
  const buttons = document.querySelectorAll(".option");
  buttons.forEach(b => b.disabled = true);
  buttons[item.answer].classList.add("correct");

  const fb = $("feedback");
  if (i === item.answer) {
    score++;
    $("score-pill").textContent = `Score: ${score}`;
    fb.textContent = "Correct! 🎉";
    fb.className = "feedback good";
  } else {
    btn.classList.add("wrong");
    fb.textContent = `Nope — it was "${item.options[item.answer]}"`;
    fb.className = "feedback bad";
  }
  $("btn-next").hidden = false;
  $("progress-fill").style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;
}

function next() {
  current++;
  if (current < QUESTIONS.length) renderQuestion();
  else showResults();
}

function showResults() {
  $("final-score").textContent = `${score} / ${QUESTIONS.length}`;
  const msgs = ["Ouch — try again! 😅", "Not bad, keep going! 💪", "Nice work! 👏", "Wow, amazing! 🌟"];
  $("result-msg").textContent =
    score === QUESTIONS.length ? "PERFECT SCORE! You're a genius! 🏆" :
    msgs[Math.min(3, Math.floor(score / 2))];
  show("results-view");
}

$("btn-start").onclick = startQuiz;
$("btn-next").onclick = next;
$("btn-back").onclick = () => show("home-view");
$("btn-again").onclick = startQuiz;
$("btn-home").onclick = () => show("home-view");
