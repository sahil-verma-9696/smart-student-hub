import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()  # Load API from .env file

model = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant"
)

response = model.invoke("Hello MindPilot — Groq API Connected Successfully!")
print(response.content)
