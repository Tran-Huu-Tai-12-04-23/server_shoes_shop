const root = require("./root");
const user = require("./user");
const item = require("./item");

function router(app) {
  app.use("/api/", root);
  app.use("/api/user/", user);
  app.use("/api/item/", item);
}

module.exports = router;
