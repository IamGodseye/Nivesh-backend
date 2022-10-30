import { Router } from 'express'
import { makeBuisness, buySample, sellSample } from '../controller/buisness.js';
import { requireSignin } from '../middleware/index.js';

const router = Router();
router.post('/make-buisness', requireSignin, makeBuisness)
router.post('/loan-request', requireSignin, buySample)
router.post('/loan-invest', requireSignin, sellSample)


export { router }