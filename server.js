import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { readdirSync } from 'fs'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import { scheduleJob } from 'node-schedule'
import ExchangeRates from './models/exchangeRates.js'
import fetch from 'node-fetch';

import { router as stockRoutes } from './routes/stock.js'
import { router as authRoutes } from './routes/auth.js'
// const fetch = require('node-fetch')
// import axios from 'axios'
// const axios = require('axios').create({baseUrl: ``})

dotenv.config()
const app = express();
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true })
    .then(() => console.log("DB Connected......."))
    .catch((err) => console.log("DB Connection Err=>", err));

// api rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan('dev'))
app.use('/api', stockRoutes)
app.use('/api', authRoutes)


app.all('/', (req, res) => {
    return res.status(200).json({ success: true, message: 'Welcome to Nivesh v(0.0.1)' })
})


// readdirSync("./routes").map((r) => {
//     app.use("/api", require(`./routes/${r}`));
// });

scheduleJob('0 * * * *', (async () => {
    console.log('running a 60 seconds', `${process.env.EXCHANGE_RATE_URL}?access_key=${process.env.EXCHANGE_RATE_KEY}`, 'done');
    const url = `${process.env.EXCHANGE_RATE_URL}?access_key=${process.env.EXCHANGE_RATE_KEY}`
    const data =
        await
            (await fetch(url)).json()

    const exchangeRate = new ExchangeRates({ data })
    await exchangeRate.save()

}));

const PORT = 5500
app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`)
)