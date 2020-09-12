const characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

module.exports = function () {
  let password = "";

  for (let i = 0; i < 20; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * (characters.length - 0) + 0)
    );
  }

  return password;
};
