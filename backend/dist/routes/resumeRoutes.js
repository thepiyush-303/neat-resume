"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resumeController_1 = require("../controller/resumeController");
const upload_1 = require("../middlewares/upload");
const resumeRouter = (0, express_1.Router)();
resumeRouter.post('/upload', upload_1.uploadMiddleware.single('resume'), resumeController_1.handleResumeUpload);
exports.default = resumeRouter;
