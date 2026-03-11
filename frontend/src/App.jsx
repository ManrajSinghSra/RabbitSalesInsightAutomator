import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #07080f;
    --surface: #0e1018;
    --surface2: #151720;
    --border: rgba(255,255,255,0.07);
    --border-active: rgba(99,179,237,0.5);
    --accent: #63b3ed;
    --accent2: #76e4b0;
    --accent-glow: rgba(99,179,237,0.15);
    --text: #e8eaf0;
    --text-muted: #6b7280;
    --text-dim: #9ca3af;
    --error: #f87171;
    --error-bg: rgba(248,113,113,0.08);
    --success: #76e4b0;
    --success-bg: rgba(118,228,176,0.08);
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html, body, #root {
    min-height: 100%;
    width: 100%;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--surface2); border-radius: 2px; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse-bar {
    0%, 100% { opacity: 0.4; transform: scaleX(0.3); }
    50%       { opacity: 1;   transform: scaleX(1); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes bgFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.05); }
    66%       { transform: translate(-20px, 10px) scale(0.97); }
  }
  @keyframes orb2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%       { transform: translate(-40px, 30px) scale(1.08); }
  }

  .page {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  /* Background orbs */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }
  .orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(99,179,237,0.12) 0%, transparent 70%);
    top: -100px; left: -100px;
    animation: bgFloat 12s ease-in-out infinite;
  }
  .orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(118,228,176,0.10) 0%, transparent 70%);
    bottom: -80px; right: -80px;
    animation: orb2 10s ease-in-out infinite;
  }

  /* Grid texture overlay */
  .grid-overlay {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  /* Main layout */
  .layout {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1100px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
    animation: fadeUp 0.6s ease both;
  }

  /* Left panel — branding */
  .brand-panel {
    padding: 2rem 1rem 2rem 0;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .brand-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 0.4rem 1rem;
    font-size: 0.75rem;
    font-family: var(--font-body);
    color: var(--accent);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    width: fit-content;
  }

  .brand-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent2);
    box-shadow: 0 0 8px var(--accent2);
    animation: pulse-bar 2s ease-in-out infinite;
  }

  .brand-title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--text);
  }

  .brand-title span {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .brand-desc {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-dim);
    font-weight: 300;
    max-width: 380px;
  }

  .stats-row {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .stat-num {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text);
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .stat-divider {
    width: 1px;
    background: var(--border);
    align-self: stretch;
  }

  /* Right panel — card */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-shadow: 0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03);
    backdrop-filter: blur(20px);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--border);
  }

  .card-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(99,179,237,0.2), rgba(118,228,176,0.2));
    border: 1px solid rgba(99,179,237,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
  }

  .card-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
  }

  .card-subtitle {
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-top: 0.1rem;
  }

  /* Form fields */
  .field { display: flex; flex-direction: column; gap: 0.5rem; }

  .field-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-dim);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-family: var(--font-display);
  }

  /* Drop zone */
  .dropzone {
    border: 1.5px dashed rgba(99,179,237,0.25);
    border-radius: 12px;
    padding: 1.8rem 1rem;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background: rgba(99,179,237,0.03);
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .dropzone:hover {
    border-color: rgba(99,179,237,0.5);
    background: rgba(99,179,237,0.06);
  }

  .dropzone.active {
    border-color: var(--accent2);
    background: rgba(118,228,176,0.06);
  }

  .dropzone-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 0.25rem;
  }

  .dropzone-text {
    font-size: 0.9rem;
    color: var(--text-dim);
    font-weight: 400;
  }

  .dropzone-hint {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .file-name {
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--accent2);
    font-family: var(--font-display);
  }

  .file-size {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  /* Email input */
  .email-input {
    width: 100%;
    padding: 0.85rem 1rem;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-size: 0.95rem;
    font-family: var(--font-body);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .email-input::placeholder { color: var(--text-muted); }

  .email-input:focus {
    border-color: var(--border-active);
    box-shadow: 0 0 0 3px rgba(99,179,237,0.08);
  }

  /* Submit button */
  .btn-submit {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #3b82f6, #10b981);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 700;
    font-family: var(--font-display);
    cursor: pointer;
    letter-spacing: 0.03em;
    position: relative;
    overflow: hidden;
    transition: opacity 0.2s, transform 0.15s;
  }

  .btn-submit:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  .btn-submit:active:not(:disabled) { transform: translateY(0); }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  /* Progress bar */
  .progress-wrap {
    height: 3px;
    background: var(--surface2);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 2px;
    animation: pulse-bar 1.2s ease-in-out infinite;
    transform-origin: left;
  }

  /* Result boxes */
  .result-box {
    border-radius: 12px;
    padding: 1.2rem;
    animation: fadeUp 0.4s ease both;
  }

  .result-box.success {
    background: var(--success-bg);
    border: 1px solid rgba(118,228,176,0.2);
  }

  .result-box.error {
    background: var(--error-bg);
    border: 1px solid rgba(248,113,113,0.2);
  }

  .result-title {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .result-title.success { color: var(--success); }
  .result-title.error   { color: var(--error); }

  .preview-box {
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    padding: 1rem;
    margin-top: 0.75rem;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .preview-label {
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.5rem;
    font-family: var(--font-display);
  }

  .preview-text {
    font-size: 0.83rem;
    color: var(--text-dim);
    line-height: 1.7;
  }

  .btn-reset {
    margin-top: 1rem;
    padding: 0.55rem 1.2rem;
    background: transparent;
    border: 1px solid rgba(118,228,176,0.3);
    color: var(--accent2);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.82rem;
    font-family: var(--font-display);
    font-weight: 600;
    transition: background 0.2s;
  }

  .btn-reset:hover { background: rgba(118,228,176,0.07); }

  /* Footer */
  .page-footer {
    position: relative;
    z-index: 1;
    margin-top: 2.5rem;
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }

  /* ── RESPONSIVE ───────────────────────────────── */

  /* Tablet */
  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
      max-width: 560px;
    }
    .brand-panel {
      padding: 0;
      gap: 1.25rem;
      text-align: center;
      align-items: center;
    }
    .brand-desc { max-width: 100%; }
    .stats-row { justify-content: center; }
  }

  /* Mobile */
  @media (max-width: 520px) {
    .page { padding: 1.25rem 1rem 2rem; }
    .card { padding: 1.5rem 1.25rem; gap: 1.25rem; border-radius: 16px; }
    .brand-title { font-size: 1.9rem; }
    .brand-desc { font-size: 0.9rem; }
    .dropzone { padding: 1.4rem 1rem; }
    .btn-submit { padding: 0.9rem; font-size: 0.9rem; }
    .stat-num { font-size: 1.2rem; }
    .orb-1 { width: 280px; height: 280px; }
    .orb-2 { width: 220px; height: 220px; }
  }

  /* Very small phones */
  @media (max-width: 360px) {
    .stats-row { gap: 1rem; }
    .card { padding: 1.25rem 1rem; }
    .brand-title { font-size: 1.65rem; }
  }
`;

export default function App() {
  const [file, setFile]     = useState(null);
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const fileRef = useRef();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styleTag;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSubmit = async () => {
    if (!file || !email) {
      setStatus("error");
      setMessage("Please select a file and enter a recipient email.");
      return;
    }
    setStatus("loading");
    setMessage("");
    setPreview("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {
      const res = await axios.post(`${API_URL}/api/analyze`, formData);
      setMessage(res.data.message);
      setPreview(res.data.preview);
      setStatus("success");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setEmail("");
    setStatus("idle");
    setMessage("");
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="page">
      {/* Background */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="grid-overlay" />

      <div className="layout">
        {/* ── Left: Branding ── */}
        <div className="brand-panel">
          <div className="brand-badge">
            <span className="brand-dot" />
            Rabbitt AI · Sales Intelligence
          </div>

          <div>
            <h1 className="brand-title">
              Sales Insight<br />
              <span>Automator</span>
            </h1>
          </div>

          <p className="brand-desc">
            Upload your quarterly sales data and receive a
            professionally crafted executive summary — powered by
            GPT-4o-mini and delivered straight to your inbox.
          </p>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-num">~15s</span>
              <span className="stat-label">Analysis Time</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">CSV</span>
              <span className="stat-label">& Excel</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">GPT</span>
              <span className="stat-label">4o-mini</span>
            </div>
          </div>
        </div>

        {/* ── Right: Card ── */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon">📊</div>
            <div>
              <div className="card-title">Generate Summary</div>
              <div className="card-subtitle">Upload data · Get AI insights · Receive email</div>
            </div>
          </div>

          {/* File Upload */}
          <div className="field">
            <label className="field-label">Sales Data File</label>
            <div
              className={`dropzone ${file ? "active" : ""}`}
              onClick={() => fileRef.current.click()}
            >
              {file ? (
                <>
                  <div className="dropzone-icon">📄</div>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                </>
              ) : (
                <>
                  <div className="dropzone-icon">⬆️</div>
                  <span className="dropzone-text">Click to upload file</span>
                  <span className="dropzone-hint">.csv or .xlsx · Max 5MB</span>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {/* Email */}
          <div className="field">
            <label className="field-label">Recipient Email</label>
            <input
              className="email-input"
              type="email"
              placeholder="executive@rabbittai.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={status === "loading"}
          >
            {status === "loading" && <span className="btn-shimmer" />}
            {status === "loading" ? "⏳  Analyzing & Sending..." : "🚀  Generate & Send Summary"}
          </button>

          {/* Progress */}
          {status === "loading" && (
            <div className="progress-wrap">
              <div className="progress-bar" />
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="result-box success">
              <div className="result-title success">✅ {message}</div>
              {preview && (
                <div className="preview-box">
                  <div className="preview-label">Summary Preview</div>
                  <p className="preview-text">{preview}</p>
                </div>
              )}
              <button className="btn-reset" onClick={reset}>
                ↩ Upload Another File
              </button>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="result-box error">
              <div className="result-title error">❌ {message}</div>
            </div>
          )}
        </div>
      </div>

      <p className="page-footer">
        Made By Manraj Singh For the Assignment for Rabbitt AI
      </p>
    </div>
  );
}