import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import { hashPassword, isValidPassword } from "../../utils/crypt.utils.js";
import newUserDTO from "../../DAO/DTO/newUser.dto.js";
import userDao from "../../DAO/users.dao.js";
import { githubID, githubSecret, githubURL } from "../main.config.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const newUser = new newUserDTO(req.body);
          const user = await userDao.findByEmail({ email: username });

          const hashedPassword = hashPassword(newUser.password);
          const newUserInfo = {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            age: newUser.age,
            password: hashedPassword,
          };

          const createdUser = await userDao.create(newUserInfo);

          done(null, createdUser);
        } catch (error) {
          console.error("Register error", error);
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userDao.findByEmail({ email: username });

          if (!user) {
            logger.error("Invalid password and user");
            return done(null, false);
          }

          if (!isValidPassword(password, user)) {
            logger.error("Invalid password and user");
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: githubID,
        clientSecret: githubSecret,
        callbackURL: githubURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userDao.findByEmail({
            email: profile._json.email,
          });

          if (!user) {
            const newUserInfo = {
              first_name: profile._json.name,
              last_name: "",
              age: 21,
              email: profile._json.email,
              password: "",
            };
            const newUser = await userDao.create(newUserInfo);
            return done(null, newUser);
          }
          done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userDao.findById(id);

      if (!user) {
        return done(new Error("User not found"), null);
      }

      done(null, user);
    } catch (error) {
      console.error(error);
    }
  });
};

export default initializePassport;
