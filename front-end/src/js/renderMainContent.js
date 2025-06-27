import { DUMMY_CONTENT_DATA } from "./dummyData.js";
import { toggleFormPage } from "./app.js";
import { showLoginForm } from "./auth-forms/loginForm.js";
import { showRegistrationForm } from "./auth-forms/registrationForm.js";

const mainContent = document.getElementById("main-content");

function getContentCard(data) {
  const { imgColor, title, id } = data;

  return `
        <div
            class="group w-[90%] bg-purple-100 cursor-pointer rounded-xl overflow-hidden border-b-4 border-transparent hover:opacity-85 hover:border-purple-900 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl animate-fade-in"
          >
            <div
              class="w-full min-h-[10rem] flex justify-center items-center mb-1 animate-fade-in-down"
              style="background-color: ${imgColor}"
            >
              <img
                src="src/assets/play-btn.svg"
                alt="play button"
                class="size-1/6 select-none group-hover:scale-125 transition-transform duration-300"
                draggable="false"
              />
            </div>
            <h3
              class="text-2xl font-semibold ml-2 my-4 text-purple-600 truncate group-hover:underline group-hover:text-purple-900 transition-colors duration-300 animate-fade-in-up"
            >
             ${title}
            </h3>
          </div>
    `;
}

export default function renderMainContent(state) {
  const { currentUser } = state;

  let html;
  if (currentUser) {
    html = `
        <h2
          class="text-center mb-10 text-5xl font-bold uppercase text-purple-900 animate-fade-in-down"
        >
          For you, ${currentUser.name}
        </h2>
         <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start justify-items-center gap-y-10 gap-x-6 w-full">
          ${DUMMY_CONTENT_DATA.map((data) => getContentCard(data)).join("")}
        </div>
    `;

    mainContent.innerHTML = html;
  }
  if (!currentUser) {
    html = `
            <div
          class="flex grow flex-col justify-center items-center w-full min-h-[60vh] bg-gradient-to-br from-purple-100 via-purple-200 to-pink-100 rounded-2xl shadow-lg p-6 animate-fade-in"
        >
          <h1 class="text-4xl sm:text-5xl font-extrabold mb-4 text-center bg-gradient-to-r from-purple-700 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in-down">
            Welcome!
          </h1>
          <p class="text-xl sm:text-2xl text-purple-700 font-semibold mb-8 text-center animate-fade-in-up">
            Please, <span class="font-bold text-purple-900">Sign In</span> or <span class="font-bold text-purple-900">Sign Up</span> to access the page.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
            <button
              class="text-2xl font-bold px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-purple-400 to-pink-400 text-white shadow-xl transition-all duration-300 hover:bg-gradient-to-l hover:from-pink-400 hover:to-purple-700 hover:scale-105 focus:ring-4 focus:ring-purple-300"
              id="login-btn"
            >
              Sign In
            </button>
            <button
              class="text-2xl font-bold px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-purple-700 text-white shadow-xl transition-all duration-300 hover:bg-gradient-to-l hover:from-purple-700 hover:to-pink-400 hover:scale-105 focus:ring-4 focus:ring-pink-300"
              id="register-btn"
            >
              Sign Up
            </button>
          </div>
        </div>
    `;

    mainContent.innerHTML = html;

    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");

    [registerBtn, loginBtn].forEach((btn) => {
      btn.addEventListener("click", () => {
        toggleFormPage();
        if (btn === registerBtn) {
          showRegistrationForm();
        } else {
          showLoginForm();
        }
      });
    });
  }
}
