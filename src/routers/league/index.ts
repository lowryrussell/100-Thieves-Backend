/**
 * league router
 */
import * as express from 'express';
import { Leagues } from './Leagues';

const router = express.Router();

router.use('/league', new Leagues().getRoutes());

export default router;