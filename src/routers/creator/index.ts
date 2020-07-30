/**
 * creator router
 */
import * as express from 'express';
import { Creators } from './Creators';

const router = express.Router();

router.use('/creator', new Creators().getRoutes());

export default router;