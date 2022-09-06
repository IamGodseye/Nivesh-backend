import { Router } from 'express'
import { createWallet } from '../controller/wallet';
import { requireSignin } from '../middleware';

const router = Router();
router.get('/create-wallet', requireSignin, createWallet)
router.post('/create-order', requireSignin,)
router.post('/verfiy-order', requireSignin,)

module.exports = router