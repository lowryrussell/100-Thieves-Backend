import * as chai from 'chai';
import { server } from '../index'

const chaiHttp = chai.use(require('chai-http'));

export class BaseTest {

    chai: any;
    should: any;
    route: string;
    server: any;

    constructor() {
        this.server = server.getServerInstance();
        this.route = `/${process.env.API_VERSION}/`;
        this.chai = chai;
        this.chai.use(chaiHttp);
        this.should = chai.should();
    }
}