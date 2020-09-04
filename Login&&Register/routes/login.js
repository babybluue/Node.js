const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const passport = require('passport')

router
  .get("/login", (req, res) => {
    res.render("login");
  })
  .post("/login", passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/index/login',
    failureFlash: true
  })
  );

router
  .get("/register", (req, res) => {
    res.render("register");
  })
  .post("/register", async (req, res) => {
    let errors = [];
    const { name, password, password2 } = req.body;
    //~verify the format of the username and password
    if (name.length < 5 || password.length < 6) {
      errors.push({ msg: "name or password is too short" });
      return res.render("register", {
        errors,
        name,
        password,
        password2
      });
    }
    if (password2 !== password) {
      errors.push({
        msg: 'Password not match'
      });
      return res.render("register", {
        errors,
        name,
        password,
        password2
      });
    }
    //~check if exsited and create the new one including hash the password
    const user = await User.findOne({ name });
    if (user) {
      errors.push({ msg: "name has exsited" });
      res.render("register", { errors, name, password });
    } else {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
        name,
        password: passwordHash,
      });
      const savedUser = await newUser.save();
      console.log(savedUser);
      req.flash("success_info", "Register success, please login");
      res.redirect("login");
    }
  });



module.exports = router;
