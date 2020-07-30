import * as dotenv from 'dotenv';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as passport from 'passport';

import { PassportConfig } from './config/passport';

import { default as creatorRouter } from './routers/creator';
import { default as lookbookRouter } from './routers/lookbook';
import { default as playerRouter } from './routers/player';
import { default as leagueRouter } from './routers/league';

class App {

    public express: express.Application;

    constructor() {
        this.setEnvironment();
        this.express = express();
        this.database();
        this.middleware();
        this.routes();
    }


    /**
     * database connection
     */
    private database(): void {
        mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
        mongoose.connection.on('error', () => {
            console.log('MongoDB connection error. Please make sure MongoDB is running.');
            process.exit();
        });
    }

    /**
     * http(s) request middleware
     */
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json({limit: '50mb'}));
        this.express.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
        this.express.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*'); // dev only
            res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            if(req.method === 'OPTIONS'){
                res.status(200).send();
            } else {
                next();
            }
        });
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        const pConfig = new PassportConfig(passport);
        pConfig.init();
    }

    /**
     * app environment configuration
     */
    private setEnvironment(): void {
        dotenv.config({ path: '.env' });
    }

    /**
     * API main v1 routes
     */
    private routes(): void {
        this.express.use('/api/v1', creatorRouter);
        this.express.use('/api/v1', lookbookRouter);
        this.express.use('/api/v1', playerRouter);
        this.express.use('/api/v1', leagueRouter);
        this.express.use('/', (req, res) => {
            res.status(404).send({ error: `path doesn't exist`});
        });
    }

}

export default new App().express;
