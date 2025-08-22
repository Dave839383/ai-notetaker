from fastapi import FastAPI
from endpoints import router

app = FastAPI()

# Include the router with v1 prefix
app.include_router(router, prefix="/v1")