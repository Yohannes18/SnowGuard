from fastapi import FastAPI
from .modules import attacks

app = FastAPI(title="Exploit Lab API", version="0.1")


app.include_router(attacks.router, prefix="/attack", tags=["attacks"])

@app.get("/")
def root():
    return {"message": "Xploit-Lab API is running..."}
