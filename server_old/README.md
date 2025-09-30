# SnowGuard Backend

## Overview
SnowGuard is a web application designed for URL and email analysis. This FastAPI backend serves as the core of the application, providing endpoints for users to submit URLs and email addresses for analysis.

## Project Structure
```
server
├── app
│   ├── main.py                # Entry point of the FastAPI application
│   ├── api
│   │   └── endpoints.py       # API route definitions
│   ├── core
│   │   └── config.py          # Configuration settings
│   ├── models
│   │   └── analysis.py        # SQLAlchemy models for analysis results
│   ├── services
│   │   └── analyzer.py        # Business logic for analysis
│   └── utils
│       └── email_url_utils.py # Utility functions for email and URL processing
├── requirements.txt            # Project dependencies
└── README.md                   # Project documentation
```

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```bash
   uvicorn app.main:app --reload
   ```

## Usage
- The API provides endpoints for analyzing URLs and emails. Refer to the API documentation for detailed usage instructions.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.