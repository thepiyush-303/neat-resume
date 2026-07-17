import express from "express"
import cors from "cors"
import resumeRouter from "./routes/resumeRoutes"

const app = express()

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json())


app.use('/api/resume', resumeRouter)
app.get('/', (req, res) =>{
    res.send("Hey, I am working")
})

app.listen(5000, () => {
    console.log("server is up")
})