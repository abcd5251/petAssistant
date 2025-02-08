# AI Backend
API for the latest news and RAG knowledge base on DeFi strategies

## Execution
Put your API key into .env file
```bash
OPENAI_MODEL=""
OPENAI_API_KEY=""
SERPER_API=""
QDRANT_DB_URL=""
QDRANT_APIKEY=""
```
Install Package
```
pip install -r requirements.txt
```

Server
```
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```