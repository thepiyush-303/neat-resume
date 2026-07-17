import { formatResumeData } from "../controller/textFormattingController";

import { Router } from "express";

const formattingRouter = Router();

formattingRouter.post('/llm', formatResumeData)

export default formattingRouter;