import os
import json
import base64
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import pandas as pd
import io

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="Escape Ramp Invoice Parser", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://escaperamp.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ParsedInvoice(BaseModel):
    vendor_name: str
    invoice_date: str
    invoice_number: str
    total_amount: float
    line_items: List[Dict[str, Any]]
    extracted_text: str
    confidence_score: float
    file_type: str

class ProcessingResponse(BaseModel):
    success: bool
    data: Optional[ParsedInvoice] = None
    error: Optional[str] = None
    processing_time: float

def extract_text_from_image(image_data: bytes) -> str:
    """Extract text from image using OCR (placeholder for now)"""
    # In production, you'd use pytesseract or a cloud OCR service
    # For now, return a placeholder
    return "Sample extracted text from image"

def extract_text_from_pdf(pdf_data: bytes) -> str:
    """Extract text from PDF (placeholder for now)"""
    # In production, you'd use PyPDF2 or a cloud PDF service
    return "Sample extracted text from PDF"

def parse_csv_data(csv_data: bytes) -> str:
    """Parse CSV data and return structured text"""
    try:
        df = pd.read_csv(io.BytesIO(csv_data))
        return df.to_string()
    except Exception as e:
        return f"Error parsing CSV: {str(e)}"

def extract_invoice_data_with_openai(text_content: str, file_type: str) -> Dict[str, Any]:
    """Use OpenAI to extract structured invoice data from text"""
    
    system_prompt = """
    You are an expert at extracting financial data from documents. Extract the following information from the provided text:
    - vendor_name: The name of the vendor/company
    - invoice_date: The date of the invoice (YYYY-MM-DD format)
    - invoice_number: The invoice number or reference
    - total_amount: The total amount (numeric value only)
    - line_items: Array of line items with description, quantity, unit_price, and total
    
    Return the data as a valid JSON object. If any field cannot be determined, use null.
    """
    
    user_prompt = f"""
    Extract invoice data from this {file_type} content:
    
    {text_content}
    
    Return only the JSON object, no additional text.
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=1000
        )
        
        # Parse the response
        content = response.choices[0].message.content.strip()
        
        # Try to extract JSON from the response
        if content.startswith('```json'):
            content = content[7:-3]  # Remove ```json and ```
        elif content.startswith('```'):
            content = content[3:-3]  # Remove ``` and ```
            
        parsed_data = json.loads(content)
        
        # Add confidence score (placeholder)
        parsed_data['confidence_score'] = 0.95
        parsed_data['extracted_text'] = text_content[:500] + "..." if len(text_content) > 500 else text_content
        
        return parsed_data
        
    except Exception as e:
        # Fallback to basic extraction
        return {
            "vendor_name": "Unknown Vendor",
            "invoice_date": "2024-01-01",
            "invoice_number": "INV-001",
            "total_amount": 0.0,
            "line_items": [],
            "confidence_score": 0.0,
            "extracted_text": text_content[:500] + "..." if len(text_content) > 500 else text_content,
            "error": str(e)
        }

@app.post("/parse-invoice", response_model=ProcessingResponse)
async def parse_invoice(file: UploadFile = File(...)):
    """
    Parse invoice data from uploaded file using AI
    """
    import time
    start_time = time.time()
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Determine file type and extract text
        file_type = file.content_type or "unknown"
        text_content = ""
        
        if file_type.startswith("image/"):
            text_content = extract_text_from_image(file_content)
        elif file_type == "application/pdf":
            text_content = extract_text_from_pdf(file_content)
        elif file_type == "text/csv":
            text_content = parse_csv_data(file_content)
        elif file_type in ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]:
            # Handle Excel files
            try:
                df = pd.read_excel(io.BytesIO(file_content))
                text_content = df.to_string()
            except Exception as e:
                text_content = f"Error parsing Excel file: {str(e)}"
        else:
            # Try to decode as text
            try:
                text_content = file_content.decode('utf-8')
            except:
                text_content = "Unable to extract text from file"
        
        # Extract structured data using OpenAI
        parsed_data = extract_invoice_data_with_openai(text_content, file_type)
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        return ProcessingResponse(
            success=True,
            data=ParsedInvoice(
                vendor_name=parsed_data.get("vendor_name", "Unknown"),
                invoice_date=parsed_data.get("invoice_date", "2024-01-01"),
                invoice_number=parsed_data.get("invoice_number", "INV-001"),
                total_amount=float(parsed_data.get("total_amount", 0)),
                line_items=parsed_data.get("line_items", []),
                extracted_text=parsed_data.get("extracted_text", ""),
                confidence_score=parsed_data.get("confidence_score", 0.0),
                file_type=file_type
            ),
            processing_time=processing_time
        )
        
    except Exception as e:
        processing_time = time.time() - start_time
        return ProcessingResponse(
            success=False,
            error=str(e),
            processing_time=processing_time
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "invoice-parser"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Escape Ramp Invoice Parser API",
        "version": "1.0.0",
        "endpoints": {
            "parse_invoice": "/parse-invoice",
            "health": "/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3010) 