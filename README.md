# SnowGuard

SnowGuard is a modern web application for detecting phishing and malicious URLs/emails. Built with FastAPI (backend) and React (frontend), it provides real-time threat analysis, user authentication, and a dashboard for monitoring submissions.

---

## Features

- **Phishing Detection:** Analyze URLs and emails for suspicious patterns.
- **Threat Intelligence:** Integrates with PhishTank/VirusTotal APIs.
- **User Authentication:** Secure JWT-based login and roles.
- **Submission Logging:** Stores analysis history in PostgreSQL.
- **Modern UI:** Responsive React dashboard.

---

## Project Structure

```
backend/
  └─ app/
      ├─ main.py
      ├─ models.py
      ├─ schemas.py
      ├─ crud.py
      ├─ auth.py
      ├─ phishing.py
      └─ database.py
frontend/
  └─ src/
      ├─ components/
      ├─ pages/
      ├─ App.js
      └─ index.js
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yohannes18/snowguard.git
cd snowguard
```

### 2. Backend Setup

- Install dependencies:

  ```bash
  cd backend
  pip install -r requirements.txt
  ```

- Set up environment variables in a `.env` file:

  ```
  DATABASE_URL=postgresql://admin:admin@db:5432/snowguard
  SECRET_KEY=your_secret_key
  ```

- Run the backend:

  ```bash
  uvicorn app.main:app --reload
  ```

### 3. Frontend Setup

- Install dependencies:

  ```bash
  cd frontend
  npm install
  ```

- Start the frontend:

  ```bash
  npm start
  ```

---

## API Endpoints

- `POST /analyze` — Analyze a URL/email for phishing.
- `POST /auth/login` — Obtain JWT token.
- `GET /submissions` — List past analyses (auth required).

---

## Docker (Optional)

To run with Docker Compose:

```bash
docker-compose up --build
```

---

## Contributing

Pull requests are welcome! Please open an issue first to discuss changes.

---

## Acknowledgements

- **FastAPI:** For the amazing backend framework.
- **React:** For the flexible frontend library.
- **PhishTank & VirusTotal:** For their threat intelligence APIs.