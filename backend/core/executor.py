import httpx

async def send_payload(target_url: str, payload: str):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(f"{target_url}?q={payload}")
        reflected = payload in response.text
        return {
            "status": response.status_code,
            "payload": payload,
            "reflected": reflected,
            "snippet": response.text[:300]
        }
    except Exception as e:
        return {"error": str(e)}
