import { Request, Response, NextFunction } from "express"
import 'multer'

export const handleResumeUpload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "No File Uploaded" })
            return
        }
        const fileBuffer = req.file.buffer
        const fileName = req.file.originalname

        const fileBlob = new Blob([new Uint8Array(fileBuffer)], { type: req.file.mimetype });

        const formData = new FormData();
        formData.append('file', fileBlob, req.file.originalname);

        const pythonResponse = await fetch('http://localhost:8000/extract', {
            method: 'POST',
            body: formData
        });
        if (!pythonResponse.ok) {
            throw new Error(`Python service failed with status: ${pythonResponse.status}`);
        }

        const parsedData = await pythonResponse.json();

        // console.log(parsedData)

        res.status(200).json({
            success: true,
            message: "Resume Uploaded",
            data: {
                fileName,
                extractedText: parsedData.text
            }
        });
    } catch (err) {
        next(err)
    }
}