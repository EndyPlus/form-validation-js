import { toggleFormPage } from "../app.js";
import { DUMMY_USER_DATA, state } from "../dummyData.js";
import {
  isValidEmail,
  isEmptyFieldsLeft,
  replaceAllTabs,
  isPasswordIncludesLetter,
  isPasswordIncludesNumber,
  isValidPhoneNumber,
  isPasswordIncludesWrongSymbols,
  isDataAlreadyExist,
  transformRegData,
} from "../utils/util-funcs.js";
import {
  showForm,
  removeAllErrors,
  addErrToArr,
  removeErrFromArr,
  renderFormErrorsList,
  handleAddInputError,
  handleRemoveInputError,
  showAllEmptyInputs,
  areAllInputsFilled,
  logIn,
} from "./authFormGeneral.js";
import { loginForm, showLoginForm } from "./loginForm.js";

// REGISTRATION ELEMENTS
export const registrationForm = document.getElementById("registration-form");
const registerReturnBtn = document.getElementById("register-return-btn");
const switchToLoginForm = document.getElementById("switch-to-login");
const registerFormErrorList = document.getElementById("reg-form-error-list");
const registerInputs = registrationForm.querySelectorAll("input");

// REGISTRATION INPUTS
const regFormNameInput = registrationForm.querySelector(
  "#registration-form-name"
);
const regFormEmailInput = registrationForm.querySelector(
  "#registration-form-email"
);
const regFormPhoneNumberInput = registrationForm.querySelector(
  "#registration-form-number"
);
const regFormPasswordInput = registrationForm.querySelector(
  "#registration-form-password"
);
const regFormConfirmPasswordInput = registrationForm.querySelector(
  "#registration-form-confirm-password"
);

// REGISTER ERR LIST ID
const registerErrListId = "regErrorList";

// LOGIN ERRORS OBJ
const registerErrors = {
  requiredAllFields: "All fields are required.",
  wrongNameLength: "Name must be at least 2 characters long.",
  wrongEmailFormat: "Wrong email format.",
  wrongPhoneNumberFormat: "Number format is not: XX-XXX-XXXX.",
  wrongPasswordLength: "Password must be at least 8 characters long.",
  wrongPasswordCharacters: "Only English letters and numbers are allowed.",
  passwordRequiresLetter: "Password must include at least 1 English letter.",
  passwordRequiresNumber: "Password must include at least 1 number.",
  passwordsAreNotMatching: "Passwords are not matching.",
  emailIsTaken: "This email is already taken.",
  phoneNumberIsTaken: "This phone number is already taken.",
};

// DESTRUCTURING ERRORS
const {
  requiredAllFields,
  wrongNameLength,
  wrongEmailFormat,
  wrongPhoneNumberFormat,
  wrongPasswordLength,
  wrongPasswordCharacters,
  passwordRequiresLetter,
  passwordRequiresNumber,
  passwordsAreNotMatching,
  emailIsTaken,
  phoneNumberIsTaken,
} = registerErrors;

// MAKE REGISTRATION FORM VISIBLE FUNCTION
export function showRegistrationForm() {
  showForm(registrationForm, loginForm);
}

// REMOVE ALL REGISTER ERRORS FUNCTION
function removeAllRegisterErrors() {
  removeAllErrors(registerInputs, state, registerErrListId);
}

// CLEAR ALL REGISTER LOGIN ERRORS AND RESET A FORM
function clearRegisterErrorsAndFormReset() {
  removeAllRegisterErrors();
  renderRegisterFormErrorsList();
  registrationForm.reset();
}

// SWITCH TO LOGIN FORM FUNCTION
switchToLoginForm.addEventListener("click", () => {
  clearRegisterErrorsAndFormReset();

  showLoginForm();
});

// RETURN TO MAIN PAGE FUNCTION
registerReturnBtn.addEventListener("click", () => {
  clearRegisterErrorsAndFormReset();

  toggleFormPage();
});

// SHOW AND PUSH ERROR TO REGISTER ERRORS FUNCTION
function handleAddRegisterInputError(input, errMsg) {
  handleAddInputError(input, errMsg, state, registerErrListId);
}

// HIDE AND REMOVE ERROR FROM REGISTER ERRORS ARR FUNCTION
function handleRemoveRegisterInputError(input, errMsg) {
  handleRemoveInputError(input, errMsg, state, registerErrListId);
}

// REGISTER FORM ERROR LIST FUNCTION
function renderRegisterFormErrorsList() {
  renderFormErrorsList(state, registerErrListId, registerFormErrorList);
}

function addRegErrToArr(errMsg) {
  addErrToArr(state, registerErrListId, errMsg);
}

function removeRegErrFromArr(errMsg) {
  removeErrFromArr(state, registerErrListId, errMsg);
}

// DELAY FOR INPUT VALIDATION
const delayMs = 500;

// INPUT VALIDATION TIMEOUTS
let nameDebounceTimeout;
let emailDebounceTimeout;
let phoneNumDebounceTimeout;
let passwordDebounceTimeout;
let comparePasswordsDebounceTimeout;

let passForCheck = "";
let repeatPassForCheck = "";

registerInputs.forEach((input) => {
  // FOR CHECKING SAME PASSWORDS

  input.addEventListener("input", () => {
    if (areAllInputsFilled(registerInputs)) {
      removeRegErrFromArr(requiredAllFields);
    }

    if (input !== regFormNameInput) {
      input.value = replaceAllTabs(input.value);
    }

    if (input === regFormNameInput) {
      handleRemoveRegisterInputError(input, wrongNameLength);

      clearTimeout(nameDebounceTimeout);
      nameDebounceTimeout = setTimeout(() => {
        if (input.value.length < 2) {
          handleAddRegisterInputError(input, wrongNameLength);
          renderRegisterFormErrorsList();
        }
      }, delayMs);
    }

    if (input === regFormEmailInput) {
      handleRemoveRegisterInputError(input, wrongEmailFormat);
      handleRemoveRegisterInputError(input, emailIsTaken);
      clearTimeout(emailDebounceTimeout);

      emailDebounceTimeout = setTimeout(() => {
        if (!isValidEmail(input.value)) {
          handleAddRegisterInputError(input, wrongEmailFormat);
          renderRegisterFormErrorsList();
        }
      }, delayMs);
    }

    if (input === regFormPhoneNumberInput) {
      handleRemoveRegisterInputError(input, wrongPhoneNumberFormat);
      handleRemoveRegisterInputError(input, phoneNumberIsTaken);
      clearTimeout(phoneNumDebounceTimeout);

      phoneNumDebounceTimeout = setTimeout(() => {
        if (!isValidPhoneNumber(input.value)) {
          handleAddRegisterInputError(input, wrongPhoneNumberFormat);
          renderRegisterFormErrorsList();
        }
      }, delayMs);
    }

    if (input === regFormPasswordInput) {
      passForCheck = input.value;

      clearTimeout(passwordDebounceTimeout);
      handleRemoveRegisterInputError(input, wrongPasswordLength);
      handleRemoveRegisterInputError(input, passwordRequiresLetter);
      handleRemoveRegisterInputError(input, passwordRequiresNumber);
      handleRemoveRegisterInputError(input, wrongPasswordCharacters);

      passwordDebounceTimeout = setTimeout(() => {
        if (input.value.length < 8) {
          handleAddRegisterInputError(input, wrongPasswordLength);
        }
        if (!isPasswordIncludesLetter(input.value)) {
          handleAddRegisterInputError(input, passwordRequiresLetter);
        }
        if (!isPasswordIncludesNumber(input.value)) {
          handleAddRegisterInputError(input, passwordRequiresNumber);
        }
        if (isPasswordIncludesWrongSymbols(input.value)) {
          handleAddRegisterInputError(input, wrongPasswordCharacters);
        }

        renderRegisterFormErrorsList();
      }, delayMs);
    }

    if (input === regFormConfirmPasswordInput) {
      repeatPassForCheck = input.value;
    }

    if (
      input === regFormPasswordInput ||
      input === regFormConfirmPasswordInput
    ) {
      clearTimeout(comparePasswordsDebounceTimeout);

      handleRemoveRegisterInputError(
        regFormPasswordInput,
        passwordsAreNotMatching
      );
      handleRemoveRegisterInputError(
        regFormConfirmPasswordInput,
        passwordsAreNotMatching
      );

      comparePasswordsDebounceTimeout = setTimeout(() => {
        if (
          passForCheck !== repeatPassForCheck &&
          repeatPassForCheck.length > 0
        ) {
          handleAddRegisterInputError(
            regFormPasswordInput,
            passwordsAreNotMatching
          );
          handleAddRegisterInputError(
            regFormConfirmPasswordInput,
            passwordsAreNotMatching
          );
        }

        renderRegisterFormErrorsList();
      }, delayMs);
    }

    renderRegisterFormErrorsList();
  });
});

// LOG IN FUNCTION
function regFormLogIn(user) {
  logIn(state, registrationForm, user);
}

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(registrationForm);
  const data = Object.fromEntries(formData.entries());
  const toSendData = transformRegData(data);

  // Очистити помилки перед новою спробою
  removeAllRegisterErrors();
  renderRegisterFormErrorsList();

  // Перевірки клієнтські
  if (isEmptyFieldsLeft(data)) {
    showAllEmptyInputs(registerInputs);
    addRegErrToArr(requiredAllFields);
    renderRegisterFormErrorsList();
    return;
  }

  // Відправка даних на сервер
  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSendData),
    });

    const result = await response.json();

    if (!response.ok) {
      // Помилки валідації або інші з бекенду
      if (result.errors && Array.isArray(result.errors)) {
        result.errors.forEach((errMsg) => {
          // Можеш розширити логіку і показувати помилки на конкретних інпутах
          addRegErrToArr(errMsg);
        });
      } else if (result.message) {
        addRegErrToArr(result.message);
      }
      renderRegisterFormErrorsList();
      return;
    }

    // Успішна реєстрація - сервер повертає об'єкт користувача
    regFormLogIn(result.user);
  } catch (error) {
    addRegErrToArr("Server error. Please try again later.");
    renderRegisterFormErrorsList();
  }
});
