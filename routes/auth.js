import { Router } from 'express'
import { requireSignin } from '../middleware/index.js';
import { signup, login, doKyc, verifyKyc } from '../controller/auth.js'

const router = Router();
router.post('/signup', signup)
router.post('/login', login)
router.post('/kyc', requireSignin, doKyc)
router.get('/kyc-verify', requireSignin, verifyKyc)

export { router }