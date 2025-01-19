const bcrypt = require("bcrypt");

const saltRounds = bcrypt.genSaltSync(12);
const hashPassword = async (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
