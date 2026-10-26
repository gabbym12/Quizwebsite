// public/app.js - Phase 2 auth + RBAC UI
const $ = (id) => document.getElementById(id);

let currentUser = null;

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

// Render the role-aware UI: admins see extra nav + badge
function showLoggedIn(user) {
  currentUser = user;
  const isAdmin = user.role === "admin";

  $("topbar").classList.remove("hidden");
  $("welcome").textContent = `Hi, ${user.username}! 💜`;
  $("nav-admin").classList.toggle("hidden", !isAdmin);

  $("hello").textContent = `Welcome, ${user.username}!`;
  const badge = $("role-badge");
  badge.textContent = isAdmin ? "⭐ Admin" : "🎽 Player";
  badge.className = "role-badge" + (isAdmin ? " admin" : "");
  document.querySelectorAll(".admin-only").forEach((el) => el.classList.toggle("hidden", !isAdmin));

  showCard("home-card");
}

function showLoggedOut() {
  currentUser = null;
  $("topbar").classList.add("hidden");
  document.querySelectorAll(".admin-only").forEach((el) => el.classList.add("hidden"));
  showCard("login-card");
  setMsg("");
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
