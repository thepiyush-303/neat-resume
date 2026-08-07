"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const resumeRoutes_1 = __importDefault(require("./routes/resumeRoutes"));
const formattingRoutes_1 = __importDefault(require("./routes/formattingRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
app.use(express_1.default.json());
app.use('/api/resume', resumeRoutes_1.default);
app.use('/api/format', formattingRoutes_1.default);
app.get('/', (req, res) => {
    res.send("Hey, I am working");
});
app.listen(5000, () => {
    console.log("server is up");
});
