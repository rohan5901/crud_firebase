const jwt = require("jsonwebtoken");
const { User } = require("../config");
const { decrypt } = require("./encrypt_decrypt");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(token, "thisissecret", async function (err, encryptedID) {
      try {
        if (err) {
          res.status(400).send({ msg: "cannot decode" });
          return;
        }
        const id = decrypt(encryptedID);
        const user = await User.doc(String(id)).get();
        if (!user.exists) {
          throw new Error();
        }
        req.user = { id, ...user.data() };
        next();
      } catch (e) {
        res.status(400).send({ error: "You are not authorized!" });
      }
    });
  } catch (e) {
    res.status(400).send({ error: "create an account first!" });
  }
};

module.exports = auth;
