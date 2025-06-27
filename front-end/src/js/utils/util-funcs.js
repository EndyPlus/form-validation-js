export function isValidEmail(email) {
  if (email.includes(" ")) return false;

  const emailParts = email.split("@");
  if (emailParts.length !== 2) return false;

  const [localPart, domainPart] = emailParts;

  if (!localPart.length || !domainPart.length) return false;
  if (!domainPart.includes(".")) return false;
  if (domainPart.startsWith(".") || domainPart.endsWith(".")) return false;

  return true;
}

export function isEmptyFieldsLeft(data) {
  return Object.values(data).some((v) => v.trim().length === 0);
}

export function replaceAllTabs(value) {
  return value.replaceAll(" ", "");
}

export function isPasswordIncludesLetter(password) {
  return /[a-zA-Z]/.test(password);
}

export function isPasswordIncludesNumber(password) {
  return /[0-9]/.test(password);
}

export function isPasswordIncludesWrongSymbols(password) {
  return /[^0-9A-Za-z]/.test(password);
}

export function isValidPhoneNumber(phone) {
  const cleaned = phone.replace(/[\s-]/g, "");
  return /^\d{9}$/.test(cleaned);
}

export function transformRegData(data) {
  const { name, email, phoneNumber, password } = data;

  const validName = name.trim();
  const validEmail = email.toLowerCase();
  const validNumber = `+380${phoneNumber}`;

  return {
    name: validName,
    email: validEmail,
    phoneNumber: validNumber,
    password,
  };
}

export function isDataAlreadyExist(arr, userData, key) {
  return arr.find((obj) => obj[key] === userData[key]);
}
