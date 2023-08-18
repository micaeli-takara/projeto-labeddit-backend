import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { postRouter } from './routes/postRouter'
import { userRouter } from './routes/userRouter'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT) || 3003}`)
})

app.use("/users", userRouter)

app.use("/posts", postRouter)

app.get("/ping", (req, res) => {
    res.send("Pong!")
})