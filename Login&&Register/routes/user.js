const router = require("express").Router();
const multer = require('multer')

const authentication = (req, res, next) => {
  if (req.user) {
    return next()
  }
  req.flash('warning', 'Please login to view the resource')
  res.redirect("/index/login");
}

router.get("/", (req, res) => {
  res.render("index");
})
  .get('/index', (req, res) => {
    res.render('index')
  })
  .get("/user", authentication, (req, res) => {
    res.render('user', { name: req.user.name })
  })
  .get('/logout', (req, res) => {
    req.logout()
    req.flash('logout', 'You have exited')
    res.redirect('index/login')
  })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, req.body.filename + '.png')
  }
})

const upload = multer({ storage })

router.post('/upload', upload.single('avatar'), (req, res) => {
  const filename = req.body.filename
  if (filename != 'undefined') {
    req.flash('file_success', 'Upload success')
    return res.redirect('user')
  }
  req.flash('file_error', 'Upload error')
  res.redirect('user')

})

module.exports = router;
