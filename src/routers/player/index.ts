/**
 * player router
 */
import * as express from 'express';
import { Players } from './Players';

const router = express.Router();

router.use('/player', new Players().getRoutes());

export default router;