import sqlite3

DB_PATH = "SnowGuard.db"

def list_tables_and_columns(db_path: str):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    if not tables:
        print("No tables found in the database.")
        return

    for table_name_tuple in tables:
        table_name = table_name_tuple[0]
        print(f"\nTable: {table_name}")

        # Get columns for each table
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        for col in columns:
            col_id, col_name, col_type, not_null, default_val, pk = col
            print(f"  Column: {col_name} | Type: {col_type} | Not Null: {not_null} | PK: {pk} | Default: {default_val}")

    conn.close()

if __name__ == "__main__":
    list_tables_and_columns(DB_PATH)
