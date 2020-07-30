import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStatic } from "passport";

import { Creator } from '../models/creator';

/**
 * passport jwt configuration
 */
export class PassportConfig {

    public passport: PassportStatic;

    constructor(passport: any){
        this.passport = passport;
    }

    public init() {
        let opts = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
            secretOrKey: process.env.APPLICATION_SECRET
        };

        this.passport.use(new Strategy(opts, (jwtPayload, done) => {
            Creator.findOne({_id: jwtPayload._doc._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }));
    }
}
