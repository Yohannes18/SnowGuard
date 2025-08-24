from fastapi import APIRouter
from ..core.executor import send_payload
from ..core.analyzer import analyze_response

router = APIRouter()

@router.post("/xss")
async def xss_attacks(target_url: str, payload: str):
    result = await send_payload(target_url, payload)
    finding = analyze_response(payload, result.get("snippet", ""))
    return {**result, **finding}

@router.post("/sqli")
async def sqli_attack(target_url: str, payload: str = "' OR '1'='1 --"):
    result = await send_payload(target_url, payload)
    finding = analyze_response(payload, result.get("snippet", ""))
    return {**result, **finding}