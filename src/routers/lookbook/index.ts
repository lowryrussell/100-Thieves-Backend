/**
 * lookbook router
 */
import * as express from 'express';
import { Lookbooks } from './Lookbooks';

const router = express.Router();

router.use('/lookbook', new Lookbooks().getRoutes());

export default router;