import { Router } from 'express'
import { requireSignin } from '../middleware/index.js';
import { buyCrypto, orderData, sellCrypto } from '../controller/stock.js';

const router = Router();
router.post('/buy', requireSignin, buyCrypto)
router.post('/sell', requireSignin, sellCrypto)
router.post('/order-update', requireSignin, orderData)

export { router }