import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportLocal from 'passport-local';
import User from '../models/user.model';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email: string, password: string, done: any) => {
      User.findOne({ email }, (err: any, user: any) => {
        if (err) return done(err);
        if (!user) {
          return done(null, false, {
            message: `Invalid email ${email}.`,
          });
        }
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
          if (err) return done(err);

          if (isMatch) return done(null, user);

          return done(null, false, {
            message: 'Invalid password.',
          });
        });
      });
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.APP_SECRET_KEY as string,
    },
    function (jwtToken, done) {
      User.findOne({ email: jwtToken.email }, function (err: Error, user: any) {
        if (err) return done(err);

        if (user) {
          return done(null, user, jwtToken);
        }
        return done(null, false);
      });
    }
  )
);
