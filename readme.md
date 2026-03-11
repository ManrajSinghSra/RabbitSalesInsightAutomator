cat > ~/Documents/SalesInsightAutomator/README.md << 'EOF'
# 📊 Sales Insight Automator — Rabbitt AI

An AI-powered tool that transforms raw sales CSV/Excel data into professional executive summaries delivered straight to your inbox.

## 🚀 Live URLs
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-api.onrender.com
- **Swagger Docs**: https://your-api.onrender.com/docs

## ⚡ Quick Start (Docker)
```bash
# 1. Clone the repo
git clone https://github.com/yourusername/sales-insight-automator.git
cd sales-insight-automator

# 2. Setup environment
cp backend/.env.example backend/.env
# Fill in your API keys in backend/.env

# 3. Run everything
docker compose up --build
```

Visit:
- Frontend → http://localhost:3000
- Swagger → http://localhost:8000/docs

## 🔐 Security Measures
- **Rate Limiting**: 5 requests/minute per IP via slowapi
- **File Validation**: Only .csv and .xlsx accepted, max 5MB
- **CORS**: Restricted to frontend origin only
- **Non-root Docker user**: Containers run as unprivileged user
- **No secrets in code**: All keys loaded from .env

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| AI Engine | OpenAI GPT-4o-mini |
| Email | Resend |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | Vercel + Render |

## 🔑 Environment Variables

See `backend/.env.example`:
```env
OPENAI_API_KEY=
RESEND_API_KEY=
FRONTEND_URL=http://localhost:3000
```

## 📁 Project Structure
```
sales-insight-automator/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/App.jsx
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .gitignore
└── .github/workflows/ci.yml
```
EOF