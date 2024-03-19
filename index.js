const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

//middleware to use json data
app.use(express.json());
const PORT = process.env.PORT ?? 4000;

app.use("/api/blogs", require("./routes/blog"));

app.listen(PORT, () => {
  console.log(`Listening to port : ${PORT}`);
});
