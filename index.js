const express = require("express");
const crudRoutes = require("./src/routes/crudRoutes");

const app = express();
app.use(express.json());

app.use(crudRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
