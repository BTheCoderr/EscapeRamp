# Escape Ramp Invoice Parser Service

A FastAPI-based microservice for parsing invoices and financial documents using OpenAI's GPT-4.

## Features

- **Multi-format Support**: PDF, images (JPG, PNG), CSV, Excel files
- **AI-Powered Extraction**: Uses OpenAI GPT-4 for intelligent data extraction
- **Structured Output**: Returns vendor info, invoice details, line items, and confidence scores
- **RESTful API**: Clean FastAPI endpoints with automatic documentation
- **CORS Support**: Configured for frontend integration

## Setup

### 1. Install Dependencies

```bash
cd python-service
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the `python-service` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Service

```bash
# Development
uvicorn invoice_parser:app --reload --host 0.0.0.0 --port 8000

# Production
python invoice_parser.py
```

## API Endpoints

### POST `/parse-invoice`
Upload and parse an invoice document.

**Request:**
- Content-Type: `multipart/form-data`
- Body: File upload

**Response:**
```json
{
  "success": true,
  "data": {
    "vendor_name": "ABC Supplies Co.",
    "invoice_date": "2024-01-15",
    "invoice_number": "INV-2024-001",
    "total_amount": 1250.00,
    "line_items": [
      {
        "description": "Office Supplies",
        "quantity": 5,
        "unit_price": 250.00,
        "total": 1250.00
      }
    ],
    "extracted_text": "Sample extracted text...",
    "confidence_score": 0.95,
    "file_type": "application/pdf"
  },
  "processing_time": 2.3
}
```

### GET `/health`
Health check endpoint.

### GET `/`
API information and available endpoints.

## Integration with Frontend

The service is configured to work with the Next.js frontend:

1. **CORS**: Configured for `http://localhost:3000` and `https://escaperamp.netlify.app`
2. **File Upload**: Accepts multipart form data
3. **Response Format**: JSON with structured data

## Deployment

### Local Development
```bash
uvicorn invoice_parser:app --reload
```

### Docker
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "invoice_parser:app", "--host", "0.0.0.0", "--port", "8000"]
```

### AWS App Runner
1. Push code to GitHub
2. Connect App Runner to repository
3. Set environment variables
4. Deploy

## Future Enhancements

- [ ] OCR integration with Tesseract
- [ ] PDF text extraction with PyPDF2
- [ ] Batch processing capabilities
- [ ] Webhook notifications
- [ ] Rate limiting
- [ ] Authentication middleware
- [ ] Database integration for storing results

## Error Handling

The service includes comprehensive error handling:

- File format validation
- OpenAI API error handling
- Processing timeout management
- Graceful fallbacks for parsing failures

## Monitoring

- Processing time tracking
- Confidence score reporting
- Error logging
- Health check endpoint 