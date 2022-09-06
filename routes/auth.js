import { Router } from 'express'
import { signup, login } from '../controller/auth'

const router = Router();
router.post('/signup', signup)
router.post('/login', login)
module.exports = router