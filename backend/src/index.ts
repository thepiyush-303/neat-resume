import express from "express"
import cors from "cors"
import resumeRouter from "./routes/resumeRoutes"
import formattingRouter from "./routes/formattingRoutes"

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())


app.use('/api/resume', resumeRouter)
app.use('/api/format', formattingRouter)
app.get('/', (req, res) =>{
    res.send("Hey, I am working")
})

app.listen(5000, () => {
    console.log("server is up")
})