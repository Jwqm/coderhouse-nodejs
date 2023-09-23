import passport from "passport";
import local from 'passport-local';
import GithubStrategy from 'passport-github2';

import UserManager from "../dao/mongo/managers/user.manager.js";
import auth from "../services/auth.js";

const LocalStrategy = local.Strategy; // Local = username/email + password

const usersService = new UserManager();

const initializeStrategies = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
        const hashedPassword = await auth.createHash(password);
        req.body.password = hashedPassword;
        const result = await usersService.create(req.body);
        done(null, result)
    }))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const user = await usersService.getBy({ email });
        if (!user) return done(null, false, { message: "Usuario no encontrado" });
        const isValidPassword = await auth.validatePassword(password, user.password);
        if (!isValidPassword) return done(null, false, { message: "Credenciales incorrectas" });
        done(null, user);
    }))

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.14a75011125d92bb',
        clientSecret: '7e199b973322216d67d49f89429c160e672622fe',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        const { email, name } = profile._json;
        const user = await usersService.getBy({ email });
        if (!user) {
            const newUser = {
                firstName: name,
                email,
                password: ''
            }
            const result = await usersService.create(newUser);
            done(null, result);
        } else {
            done(null, user);
        }
    }))

    passport.serializeUser((user, done) => {
        return done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await usersService.getBy({ _id: id });
        done(null, user);
    });

}

export default initializeStrategies;