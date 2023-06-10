const crypto = require("crypto"); // add / import crypto mdule
const { algorithm, key, iv } = require("../key_iv");

const encrypt = function (id) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(id, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = function (encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const id = decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  return id;
};

module.exports = { encrypt, decrypt };
