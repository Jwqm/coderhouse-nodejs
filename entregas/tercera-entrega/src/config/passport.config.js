import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import GithubStrategy from 'passport-github2';

import { usersService } from "../services/repositories.service.js";
import auth from "../services/auth.js";

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
            const result = await usersService.create({ firstName: name, email, password: '' });
            done(null, result);
        } else {
            done(null, user);
        }
    }))

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([
            auth.extractAuthToken,
        ]),
        secretOrKey: "jwtSecret",
    }, async (payload, done) => {
        return done(null, payload);
    }))

    passport.serializeUser((user, done) => {//TODO 01 - Recordar para que usaba
        return done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await usersService.getBy({ _id: id });
        done(null, user);
    });

}

export default initializeStrategies;