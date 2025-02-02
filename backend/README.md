# AI Backend

## Execution
Put your API key into .env file
```bash
OPENAI_API_KEY=""
```
Install Package
```
pip install -r requirements.txt
```

Server
```
uvicorn server:app --reload --host 0.0.0.0 --port 8030
```