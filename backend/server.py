from fastapi import FastAPI, Request
from prompts.planner import planner_prompt
import json
from models.model import OpenAIModel
from models.schema import InputData
from fastapi.middleware.cors import CORSMiddleware
# Initialize FastAPI app
app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process")
async def process_input(data: InputData):
    """
    Process input data using OpenAIModel and return the intent type.
    
    Args:
        data (InputData): Input data containing input_text.
    
    Returns:
        dict: JSON response with intent_type.
    """

    # Initialize the model instance
    planner_model_instance = OpenAIModel(system_prompt=planner_prompt, temperature=0)
    try:
        # Generate text using the model
        prompt = f"INPUT_TEXT: {data.input_text}"
        intent_type, input_token, output_token = planner_model_instance.generate_text(prompt)
        output = json.loads(intent_type)
        
        # Return response
        return output
    
    except Exception as e:
        return {"error": f"Error! {str(e)}"}