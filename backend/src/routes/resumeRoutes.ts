import { Router } from "express";
import { handleResumeUpload } from "../controller/resumeController";
import { uploadMiddleware } from "../middlewares/upload";

const resumeRouter = Router()

resumeRouter.post('/upload', uploadMiddleware.single('resume'), handleResumeUpload)

export default resumeRouter;