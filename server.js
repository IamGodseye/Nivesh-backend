import Fastify from "fastify"
import { routes } from "./modules/auth/routes.js"
const fastify = Fastify({
    logger: true
})

fastify.register(routes)
fastify.get('/', async (req, res) => {
    return { status: true, work: 'op' }
})

fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})