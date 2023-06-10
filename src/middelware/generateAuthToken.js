const jwt = require("jsonwebtoken");
generateAuthToken = async function (id) {
  const token = jwt.sign(id, "thisissecret");
  return token;
};

module.exports = generateAuthToken;
