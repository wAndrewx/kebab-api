require("dotenv").config();
const goodUser = {
  username: "testUser",
  password: "password123",
};
const goodUserRegister = {
  username: "testUser",
  email: "test@email.com",
  passwordHash: process.env.TRUSTED_USER_PW,
  verifyHash: "testHash",
  verified: true,
};
const unverified = {
  ...goodUserRegister,
  verified: false,
  username: "unverified",
  email: "unverified@email.com",
};
const nonExistantUser = {
  username: "userDNE",
  password: process.env.TRUSTED_USER_PW,
};

module.exports = { unverified, goodUser, nonExistantUser, goodUserRegister };
