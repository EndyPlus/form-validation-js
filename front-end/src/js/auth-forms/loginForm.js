import { toggleFormPage, updateApp } from "../app.js";
import { DUMMY_USER_DATA, state } from "../dummyData.js";
import { isEmptyFieldsLeft, replaceAllTabs } from "../utils/util-funcs.js";
import {
  addErrToArr,
  areAllInputsFilled,
  logIn,
  removeAllErrors,
  removeErrFromArr,
  removeInputError,
  renderFormErrorsList,
  showAllEmptyInputs,
  showForm,
  showInputError,
} from "./authFormGeneral.js";
import { registrationForm, showRegistrationForm } from "./registrationForm.js";

// LOGIN ELEMENTS
export const loginForm = document.getElementById("login-form");
const loginReturnBtn = document.getElementById("login-return-btn");
const switchToRegisterForm = document.getElementById("switch-to-registration");
const loginFormErrorList = document.getElementById("login-form-error-list");
const loginInputs = loginForm.querySelectorAll("input");

// LOGIN INPUTS
const loginFormEmailInput = loginForm.querySelector("#login-form-email");
const loginFormPasswordInput = loginForm.querySelector("#login-form-password");

// LOGIN ERR LIST ID
const loginErrListId = "loginErrorList";

// LOGIN ERRORS OBJ
const loginErrors = {
  requiredAllFields: "All fields are required.",
  wrongEmailOrPassword: "Wrong email or password.",
};

// MAKE LOGIN FORM VISIBLE FUNCTION
export function showLoginForm() {
  showForm(loginForm, registrationForm);
}

// CLEAR ALL LOGIN LOGIN ERRORS AND RESET A FORM
function clearLoginErrorsAndFormReset() {
  removeAllErrors(loginInputs, state, loginErrListId);
  renderLoginFormErrorsList();
  loginForm.reset();
}

// SWITCH TO REGISTER FORM FUNCTION
switchToRegisterForm.addEventListener("click", () => {
  clearLoginErrorsAndFormReset();

  showRegistrationForm();
});

// RETURN TO MAIN PAGE FUNCTION
loginReturnBtn.addEventListener("click", () => {
  clearLoginErrorsAndFormReset();

  toggleFormPage();
});

// PUSH LOGIN ERROR TO ARR FUNCTION
function addLoginErrToArr(errMsg) {
  addErrToArr(state, loginErrListId, errMsg);
}

// REMOVE ERROR MSG FROM ERROR LIST IN STATE FUNCTION
function removeLoginErrFromArr(errMsg) {
  removeErrFromArr(state, loginErrListId, errMsg);
}

// LOGIN FORM ERROR LIST FUNCTION
function renderLoginFormErrorsList() {
  renderFormErrorsList(state, loginErrListId, loginFormErrorList);
}

// INPUTS KEYDOWN EVENT LISTENERS
loginInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.value = replaceAllTabs(input.value);

    if (areAllInputsFilled(loginInputs)) {
      loginInputs.forEach((input) => {
        removeInputError(input);
      });

      Object.values(loginErrors).forEach((errMsg) =>
        removeLoginErrFromArr(errMsg)
      );
    }

    // EMAIL INPUT
    if (input === loginFormEmailInput) {
      removeInputError(input);
    }

    // PASSWORD INPUT
    if (input === loginFormPasswordInput) {
      removeInputError(input);
    }

    removeLoginErrFromArr(loginErrors.wrongEmailOrPassword);
    renderLoginFormErrorsList();
  });
});

// LOG IN FUNCTION
function loginFormLogIn(user) {
  logIn(state, loginForm, user);
}

// SUBMITTING LOGIN FORM
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData.entries());

  // Очистити помилки перед новою спробою
  removeAllErrors(loginInputs, state, loginErrListId);
  renderLoginFormErrorsList();

  // Клієнтська валідація — чи всі поля заповнені
  if (isEmptyFieldsLeft(data)) {
    showAllEmptyInputs(loginInputs);
    addLoginErrToArr(loginErrors.requiredAllFields);
    renderLoginFormErrorsList();
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // Помилка логіну
      if (result.message) {
        addLoginErrToArr(result.message);
      } else {
        addLoginErrToArr(loginErrors.wrongEmailOrPassword);
      }
      loginInputs.forEach((input) => showInputError(input));
      renderLoginFormErrorsList();
      return;
    }

    // Логін успішний — сервер повернув користувача
    loginFormLogIn(result.user);
  } catch (error) {
    // Не логувати помилку в консоль
    addLoginErrToArr("Server error. Please try again later.");
    renderLoginFormErrorsList();
  }
});
