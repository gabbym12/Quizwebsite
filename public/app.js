// public/app.js - Phase 2 auth UI
const $ = (id) => document.getElementById(id);

function showCard(which) {
  ["login-card", "register-card", "home-card"].forEach((id) =>
    $(id).classList.toggle("hidden", id !== which)
  );
}

function setMsg(text, kind = "") {
  const el = $("msg");
  el.textContent = text;
  el.className = "msg " + kind;
}

async function api(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function showLoggedIn(user) {
  $("topbar").classList.remove("hidden");
  $("welcome").textContent = `Hi, ${user.username}! 💜`;
  $("hello").textContent = `Welcome, ${user.username}!`;
  showCard("home-card");
}

function showLoggedOut() {
  $("topbar").classList.add("hidden");
  showCard("login-card");
  setMsg("");
}

$("show-register").onclick = (e) => { e.preventDefault(); showCard("register-card"); setMsg(""); };
$("show-login").onclick = (e) => { e.preventDefault(); showCard("login-card"); setMsg(""); };

$("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("");
  try {
    const data = await api("/api/auth/login", {
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
    const data = await api("/api/auth/register", {
      username: $("reg-username").value.trim(),
      email: $("reg-email").value.trim(),
      password: $("reg-password").value,
    });
    showLoggedIn(data.user);
  } catch (err) {
    setMsg(err.message, "error");
  }
});

$("btn-logout").onclick = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  showLoggedOut();
  setMsg("Logged out. See you soon! 👋", "good");
};

// Restore session on page load
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
