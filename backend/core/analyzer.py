SQL_ERRORS = {
    "You have an error in your sql syntax",
    "Warning: mysql",
    "Unclosed quotation mark",
    "Quoted string not properly terminated",
    "pg_query",
    "ORA_",
}

def analyze_response(payload: str, response_text: str):
    finding = {
        "reflected": payload in response_text,
        "sql_error": any(err.lower() in response_text.lower() for err in SQL_ERRORS)
    }
    return finding