const User = require('../model/User')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const passport = require('passport')


module.exports = passport.use(new LocalStrategy(
    {
        usernameField: 'name',
        passwordField: 'password'
    },
    async (name, password, done) => {

        const user = await User.findOne({ name });

        if (!user) {
            return done(null, false, { message: 'there is no infomation about the username' });
        } else {
            const validPassword = await bcrypt.compare(password, user.password)
            if (validPassword) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'check your password' });
            }
        }

    })
)

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


