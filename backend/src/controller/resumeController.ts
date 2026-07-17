import { Request, Response, NextFunction } from "express"

export const handleResumeUpload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        if(!req.file){
            res.status(400).json({success: false, message: "No File Uploaded"})
            return
        }
        const fileBuffer = req.file.buffer
        const fileName = req.file.originalname

        

        res.status(200).json({
            success: true,
            message: "Resume Uploaded",
            data:{
                fileName,
                fileSize: req.file?.size
            }
        });
    }catch(err){
        next(err)
    }
}