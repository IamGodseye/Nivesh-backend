import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { readdirSync } from 'fs'
import cors from 'cors'
dotenv.config()
const app = express();


mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true })
    .then(() => console.log("DB Connected......."))
    .catch((err) => console.log("DB Connection Err=>", err));

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan('dev'))

app.all('/', (req, res) => { return res.status(200).json({ success: true, message: 'Welcome to Nivesh v(0.0.1)' }) })

readdirSync("./routes").map((r) => {
    app.use("/api", require(`./routes/${r}`));
});


const PORT = 5500
app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`)
)