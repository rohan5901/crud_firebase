const express = require("express");
const app = express();
app.use(express.json());
const { User } = require("../config");
const generateAuthToken = require("../middelware/generateAuthToken");
const auth = require("../middelware/auth");
const { encrypt } = require("../middelware/encrypt_decrypt");
const bcrypt = require("bcryptjs");

app.post("/create", async (req, res) => {
  //checking if user email already exists, can also use username when required
  const prevUsers = await User.where("email", "==", req.body.email).get();
  if (!prevUsers.empty) {
    res.status(400).send({ msg: "user already exists" });
    return;
  }

  //creating an empty document in db
  const document = User.doc();
  const encryptedID = encrypt(document.id);
  const token = await generateAuthToken(encryptedID);
  const data = { ...req.body, token };
  data.password = await bcrypt.hash(data.password, 8);
  const re = await document.set(data); //populating db
  res.send(data);
});
app.get("/read", auth, async (req, res) => {
  res.send(req.user);
});

app.patch("/update", auth, async (req, res) => {
  const id = req.user.id;
  const new_data = req.body;
  new_data.password = await bcrypt.hash(new_data.password, 8);
  await User.doc(String(id)).update(new_data);
  res.send({ msg: "Updated" });
});

app.delete("/delete", auth, async (req, res) => {
  const id = req.user.id;
  await User.doc(id).delete();
  res.send({ msg: "Deleted" });
});

module.exports = app;
