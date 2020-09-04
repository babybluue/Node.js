const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    title: "this is what you get",
    content: "this is the test for middleware of token",
  });
});
module.exports = router;
