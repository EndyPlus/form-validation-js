import { showLoginForm } from "./auth-forms/loginForm.js";
import { state } from "./dummyData.js";
import renderMainContent from "./renderMainContent.js";

const appContent = document.getElementById("app-content");
const authBtn = document.getElementById("authBtn");
const formPage = document.getElementById("form-page");

export function updateApp(state) {
  authBtn.textContent = state.currentUser ? "Log Out" : "Log In";
  renderMainContent(state);
}

export function toggleFormPage() {
  formPage.classList.toggle("hidden");
  appContent.classList.toggle("hidden");
}

authBtn.addEventListener("click", async () => {
  if (state.currentUser) {
    await fetch("http://localhost:5000/logout", { method: "POST" });
    state.currentUser = null;
    updateApp(state);
  } else {
    showLoginForm();
    toggleFormPage();
  }
});

async function fetchCurrentUser() {
  try {
    const response = await fetch("http://localhost:5000/current-user");
    if (response.status === 404) return null;
    if (!response.ok) return null;

    const { user } = await response.json();
    return user;
  } catch {
    return null;
  }
}

async function initApp() {
  formPage.classList.add("hidden");
  const currentUser = await fetchCurrentUser();
  if (currentUser) {
    state.currentUser = currentUser;
  }
  updateApp(state);
}

initApp();
