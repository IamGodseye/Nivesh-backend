import { Router } from 'express'
import { requireSignin } from '../middleware';
import { signup, login, doKyc, verifyKyc } from '../controller/auth'

const router = Router();
router.post('/signup', signup)
router.post('/login', login)
router.post('/kyc', requireSignin, doKyc)
router.get('/kyc-verify', requireSignin, verifyKyc)
module.exports = router