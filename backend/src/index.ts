import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import resumeRouter from "./routes/resumeRoutes"
import formattingRouter from "./routes/formattingRoutes"
import authRoutes from "./routes/authRoutes"

const app = express()

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
      ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/resumes', resumeRouter)
app.use('/api/format', formattingRouter)
app.get('/', (req, res) =>{
    res.send("Hey, I am working")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`)
})