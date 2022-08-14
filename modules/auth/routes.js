import address from 'address'
import { signup, login } from './handler.js'



export const routes = async (fastify, options) => {
    fastify.post('/signup', signup)
    fastify.post('/login', login)
    fastify.get('/ip', async (req, reply) => {
        // default interface 'eth' on linux, 'en' on osx.
        const ip = address.ip();
        return { ip }
    })

}
