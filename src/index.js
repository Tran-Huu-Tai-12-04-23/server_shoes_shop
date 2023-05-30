const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const router = require("./Router/router");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  helmet({
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);
app.get("/", (req, res) => {
  res.send("hello welcome to api shoes shop");
});

const port = process.env.PORT || 3300;
app.listen(port, () => {
  console.log("listening on port : " + port);
});

router(app);
