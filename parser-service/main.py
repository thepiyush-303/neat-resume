from fastapi import FastAPI, File, UploadFile, HTTPException
import pdfplumber
import io

app = FastAPI()

@app.post("/extract")
async def extract_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        extracted_text = ""

        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if(text):
                    extracted_text += text + "\n"
        return{
            "success": True,
            "text": extracted_text.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
