from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

