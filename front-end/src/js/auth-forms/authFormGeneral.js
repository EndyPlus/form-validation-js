import { toggleFormPage, updateApp } from "../app.js";

// MAKE FORM VISIBLE FUNCTION
export function showForm(showForm, hideForm) {
  showForm.classList.remove("hidden-element");
  hideForm.classList.add("hidden-element");
}

// ERROR INPUT AND LABEL FUNCTION
export function showInputError(input) {
  input.classList.add("auth-form-input-error");
  document
    .querySelector(`label[for='${input.id}']`)
    .classList.add("auth-form-label-error");
}

// REMOVE INPUT AND LABEL ERROR STYLES FUNCTION
export function removeInputError(input) {
  input.classList.remove("auth-form-input-error");
  document
    .querySelector(`label[for='${input.id}']`)
    .classList.remove("auth-form-label-error");
}

// REMOVE ALL ERRORS FUNCTION
export function removeAllErrors(inputList, state, errArrKey) {
  inputList.forEach((input) => {
    removeInputError(input);
  });

  state[errArrKey] = [];
}

// PUSH ERROR TO ARR FUNCTION
export function addErrToArr(state, errArrKey, msg) {
  const newArr = [...state[errArrKey]];
  newArr.push(msg);
  state[errArrKey] = newArr;
}

// REMOVE ERROR MSG FROM ERROR LIST IN STATE FUNCTION
export function removeErrFromArr(state, errArrKey, errMsg) {
  const filteredErrList = state[errArrKey].filter((v) => v !== errMsg);
  state[errArrKey] = filteredErrList;
}

// FORM ERROR LIST FUNCTION (general state, key for state error array,
// form error list through querySelectorALl)
export function renderFormErrorsList(state, errArrKey, formErrList) {
  formErrList.innerHTML = "";

  const errorArray = state[errArrKey];

  if (!errorArray.length) {
    return;
  }

  state[errArrKey] = errorArray.filter((v, i, arr) => arr.indexOf(v) === i);

  const html = state[errArrKey]
    .map((err) => `<li class="auth-form-error-li">${err}</li>`)
    .join("");

  formErrList.insertAdjacentHTML("afterbegin", html);
}

// SHOW EVERY EMPTY FIELDS FUNCTION
export function showAllEmptyInputs(inputList) {
  inputList.forEach((input) => {
    if (input.value.length === 0) {
      showInputError(input);
    } else {
      removeInputError(input);
    }
  });
}

// SHOW AND PUSH ERROR TO ERRORS FUNCTION
export function handleAddInputError(input, errMsg, state, errArrKey) {
  showInputError(input);
  addErrToArr(state, errArrKey, errMsg);
}

// HIDE AND REMOVE ERROR FROM ERRORS ARR FUNCTION
export function handleRemoveInputError(input, errMsg, state, errArrKey) {
  removeInputError(input);
  removeErrFromArr(state, errArrKey, errMsg);
}

export function areAllInputsFilled(inputsList) {
  return Array.from(inputsList).every((input) => input.value.length !== 0);
}

export function logIn(state, form, user) {
  form.reset();
  toggleFormPage();
  state.currentUser = user;
  updateApp(state);
}
