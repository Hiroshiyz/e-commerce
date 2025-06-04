const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").User;
const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync(path.resolve(process.env.PUBLIC_KEY_PATH));
module.exports = (passport) => {
  let opts = {}; //passport-jwt自動抓opts
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = publicKey; //RSA256
  //jwt驗證
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        let foundUser = await User.findOne({
          where: {
            id: jwt_payload.id,
          },
        });
        if (foundUser) {
          return done(null, foundUser); //req.user = foundUser
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
