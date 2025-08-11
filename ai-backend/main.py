from typing import Union

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5050",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

v1_router = APIRouter(prefix="/v1")

class Question(BaseModel):
    question: str

@v1_router.post("/question")
def create_note(question: Question):
    return {
        "question": question.question,
        "answer": "this is a fake answer to " + question.question
    }

app.include_router(v1_router)