"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const textFormattingController_1 = require("../controller/textFormattingController");
const express_1 = require("express");
const formattingRouter = (0, express_1.Router)();
formattingRouter.post('/llm', textFormattingController_1.formatResumeData);
exports.default = formattingRouter;
