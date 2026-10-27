// public/app.js - Phase 2 auth + Phase 3 quiz engine
const $ = (id) => document.getElementById(id);

let currentUser = null;

// --- Quiz session state ---
let quiz = null;            // { id, title, questions: [...] }
let answers = {};            // questionId -> picked option letter
let current = 0;             // current question index
let timeLeft = 300;          // 5-minute countdown (seconds)
let timerId = null;
let autoSubmitted = false;

const OPTION_LETTERS = ["A", "B", "C", "D"];

function showCard(which) {
  ["login-card", "register-card", "home-card", "quiz-card", "results-card"].forEach((id) =>
    $(id).classList.toggle("hidden", id !== which)
  );
}

function setMsg(text, kind = "") {
  const el = $("msg");
  el.textContent = text;
  el.className = "msg " + kind;
}

// ============ AUTH UI ============

function showLoggedIn(user) {
  currentUser = user;
  const isAdmin = user.role === "admin";
  $("topbar").classList.remove("hidden");
  $("btn-back").classList.remove("hidden");
  $("welcome").textContent = `Hi, ${user.username}! 💜`;
  $("nav-admin").classList.toggle("hidden", !isAdmin);
  $("hello").textContent = `Welcome, ${user.username}!`;
  const badge = $("role-badge");
  badge.textContent = isAdmin ? "⭐ Admin" : "🎽 Player";
  badge.className = "role-badge" + (isAdmin ? " admin" : "");
  document.querySelectorAll(".admin-only").forEach((el) => el.classList.toggle("hidden", !isAdmin));
  showCard("home-card");
  loadQuizList();
}

function showLoggedOut() {
  currentUser = null;
  $("topbar").classList.add("hidden");
  $("btn-back").classList.add("hidden");
  document.querySelectorAll(".admin-only").forEach((el) => el.classList.add("hidden"));
  showCard("login-card");
  setMsg("");
}

async function api(path, method = "GET", body) {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ============ HOME: QUIZ LIST ============

async function loadQuizList() {
  try {
    const data = await api("/api/quizzes");
    const list = $("quiz-list");
    list.innerHTML = "";
    data.quizzes.forEach((q) => {
      const btn = document.createElement("button");
      btn.className = "quiz-pick";
      btn.innerHTML = `<span class="quiz-pick-title">${q.title}</span><span class="quiz-pick-cat">${q.category} · 10 questions</span>`;
      btn.onclick = () => startQuiz(q.id, q.title);
      list.appendChild(btn);
    });
  } catch (err) {
    setMsg(err.message, "error");
  }
}

// ============ QUIZ ENGINE ============

function startTimer() {
  timeLeft = 300;
  autoSubmitted = false;
  updateTimerDisplay();
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      autoSubmit();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const el = $("timer");
  el.textContent = `${m}:${String(s).padStart(2, "0")}`;
  el.classList.toggle("danger", timeLeft <= 30);
}

async function startQuiz(quizId, quizTitle) {
  try {
    setMsg("");
    const data = await api(`/api/quizzes/${quizId}/questions`);
    quiz = { id: quizId, title: quizTitle, questions: data.questions };
    answers = {};
    current = 0;
    $("q-quiz-title").textContent = quizTitle;
    showCard("quiz-card");
    renderQuestion();
    startTimer();
  } catch (err) {
    setMsg(err.message, "error");
  }
}

function renderQuestion() {
  const item = quiz.questions[current];
  $("q-count").textContent = `Question ${current + 1} of ${quiz.questions.length}`;
  $("progress-fill").style.width = `${(current / quiz.questions.length) * 100}%`;
  $("question").textContent = item.question_text;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("explanation").textContent = "";

  const box = $("options");
  box.innerHTML = "";
  OPTION_LETTERS.forEach((letter) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.dataset.letter = letter;
    btn.innerHTML = `<span class="option-letter">${letter}</span> ${item.options[letter]}`;
    btn.onclick = () => pick(letter);
    box.appendChild(btn);
  });

  // If this question was already answered, restore the locked feedback state
  if (answers[item.id]) restoreFeedback(item);

  // Nav controls: Previous disabled on Q1; Next unlocks after answer; Submit on last
  $("btn-prev").disabled = current === 0;
  const nextBtn = $("btn-next");
  const answered = !!answers[item.id];
  if (current === quiz.questions.length - 1) {
    nextBtn.textContent = "Submit Quiz";
    nextBtn.disabled = !answered;
  } else {
    nextBtn.textContent = "Next";
    nextBtn.disabled = !answered;
  }
}

function pick(letter) {
  const item = quiz.questions[current];
  if (answers[item.id]) return; // selection lock: can't change your answer
  answers[item.id] = letter;
  applyFeedback(item, letter);
  $("btn-next").disabled = false;
}

function applyFeedback(item, picked) {
  const correct = item.correct_option;
  document.querySelectorAll(".option").forEach((b) => {
    b.disabled = true; // lock all four buttons
    const letter = b.dataset.letter;
    b.classList.add("option-locked");
    if (letter === correct) b.classList.add("option-correct");   // green
    if (letter === picked && picked !== correct) b.classList.add("option-wrong"); // red
  });
  const fb = $("feedback");
  if (picked === correct) {
    fb.textContent = "Correct! 🎉";
    fb.className = "feedback good";
  } else {
    fb.textContent = "Not quite — the answer was " + correct + " 💔";
    fb.className = "feedback bad";
  }
  $("explanation").textContent = item.explanation;
}

function restoreFeedback(item) {
  applyFeedback(item, answers[item.id]);
}

// Previous button: preserves locked state & visual feedback
$("btn-prev").onclick = () => {
  if (current > 0) { current--; renderQuestion(); }
};

$("btn-next").onclick = () => {
  const item = quiz.questions[current];
  if (!answers[item.id]) return; // must answer first
  if (current < quiz.questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    submitQuiz();
  }
};

function scoreUp() {
  let score = 0;
  quiz.questions.forEach((q) => {
    if (answers[q.id] === q.correct_option) score++;
  });
  return score;
}

async function submitQuiz(reason = "manual") {
  if (autoSubmitted) return;
  autoSubmitted = true;
  clearInterval(timerId);
  const score = scoreUp();
  const total = quiz.questions.length;
  try {
    await api(`/api/quizzes/${quiz.id}/attempt`, "POST", { score, total_questions: total });
  } catch (err) {
    // Don't block the results screen if saving fails
    console.warn("Attempt save failed:", err.message);
  }
  showResults(score, total, reason);
}

// Auto-submit when the 5-minute timer hits 0:00
function autoSubmit() {
  document.querySelectorAll(".option").forEach((b) => (b.disabled = true));
  submitQuiz("auto");
}

function showResults(score, total, reason) {
  const pct = Math.round((score / total) * 100);
  $("final-score").textContent = `${score} / ${total}  (${pct}%)`;
  let msg;
  if (score === total) msg = "PERFECT! You're a football genius! 🏆";
  else if (pct >= 80) msg = "Amazing work! ⭐";
  else if (pct >= 50) msg = "Nice job — keep going! 💪";
  else msg = "Ouch — practice makes perfect! 😅";
  if (reason === "auto") msg += " (Time's up! ⏰)";
  $("result-msg").textContent = msg;
  showCard("results-card");
}

$("btn-retry").onclick = () => startQuiz(quiz.id, quiz.title);
$("btn-home-results").onclick = () => { showCard("home-card"); loadQuizList(); };
$("btn-back").onclick = () => {
  clearInterval(timerId);
  showCard("home-card");
  loadQuizList();
};

// ============ AUTH EVENTS ============

$("show-register").onclick = (e) => { e.preventDefault(); showCard("register-card"); setMsg(""); };
$("show-login").onclick = (e) => { e.preventDefault(); showCard("login-card"); setMsg(""); };

$("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("");
  try {
    const data = await api("/api/auth/login", "POST", {
      username: $("login-username").value.trim(),
      password: $("login-password").value,
    });
    showLoggedIn(data.user);
  } catch (err) {
    setMsg(err.message, "error");
  }
});

$("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("");
  try {
    const data = await api("/api/auth/register", "POST", {
      username: $("reg-username").value.trim(),
      email: $("reg-email").value.trim(),
      password: $("reg-password").value,
    });
    showLoggedIn(data.user);
    setMsg("Account created! 🎉", "good");
  } catch (err) {
    setMsg(err.message, "error");
  }
});

$("btn-logout").onclick = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  showLoggedOut();
  setMsg("Logged out. See you soon! 👋", "good");
};

// Restore session + role on page load
(async () => {
  try {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (data.user) showLoggedIn(data.user);
    else showLoggedOut();
  } catch {
    showLoggedOut();
  }
})();
