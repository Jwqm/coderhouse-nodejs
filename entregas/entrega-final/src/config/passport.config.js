import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import GithubStrategy from 'passport-github2';
import config from "./config.js";
import { usersService } from "../services/repositories.service.js";
import auth from "../services/auth.js";
import UserDTO from "../dao/dto/users.dto.js";

const initializeStrategies = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email', session: false }, async (req, email, password, done) => {
        try {
            const hashedPassword = await auth.createHash(password);
            req.body.password = hashedPassword;
            const result = await usersService.create(UserDTO.build(req.body));
            done(null, result);
        } catch (error) {
            done(error);
        }
    }))

    passport.use('login', new LocalStrategy({ usernameField: 'email', session: false }, async (email, password, done) => {
        try {
            const user = await usersService.getBy(UserDTO.build({ email }));
            if (!user) return done(null, false, { message: "Usuario no encontrado" });
            const isValidPassword = await auth.validatePassword(password, user.password);
            if (!isValidPassword) return done(null, false, { message: "Credenciales incorrectas" });
            done(null, user);
        } catch (error) {
            done(error);
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.14a75011125d92bb',
        clientSecret: '7e199b973322216d67d49f89429c160e672622fe',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        const { email, name } = profile._json;
        const user = await usersService.getBy({ email });
        if (!user) {
            const result = await usersService.create({ firstName: name, email, password: '' });
            done(null, result);
        } else {
            done(null, user);
        }
    }))

    passport.use('google', new GoogleStrategy({
        clientID: config.google.CLIENT,
        clientSecret: config.google.SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/googlecallback',
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        const { _json } = profile;
        const user = await usersService.getBy({ email: _json.email });
        if (user) {
            return done(null, user);
        } else {
            const newUser = {
                firstName: _json.given_name,
                lastName: _json.family_name,
                email: _json.email
            }
            const result = await usersService.createUser(newUser);
            done(null, result);
        }
    }));

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([auth.extractAuthToken]),
        secretOrKey: 'jwtSecret',
    }, async (payload, done) => {
        return done(null, payload);
    }))

    /*passport.serializeUser((user, done) => {
        return done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await usersService.getBy({ _id: id });
        done(null, user);
    });*/

}

export default initializeStrategies;