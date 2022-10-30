import { Router } from 'express'
import { addMoney, createWallet, verfiyPayment } from '../controller/wallet';
import { requireSignin } from '../middleware';

const router = Router();
router.get('/create-wallet', requireSignin, createWallet)
router.post('/create-order', addMoney)
router.post('/verify-payment', verfiyPayment)

export { router }