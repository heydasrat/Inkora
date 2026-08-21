import express, { urlencoded } from 'express'
import config from './config/config.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(express.static("./public"))
app.use(cookieParser())

export default app