export const users = [
  {
    name: "Artem",
    email: "example@example.com",
    phoneNumber: "+38044-444-4444",
    password: "12345qwerty",
    loggedIn: false,
  },
];

export function findUser(email) {
  return users.find((user) => user.email === email);
}

export function addUser(name, email, password, phoneNumber) {
  const newUser = {
    name,
    email,
    password,
    phoneNumber,
    loggedIn: true,
  };
  users.push(newUser);
  return newUser;
}

export function logOutAllUsers() {
  users.forEach((user) => (user.loggedIn = false));
}
