# 🔒 Secure AI Backend

This backend server protects your AI API keys and implements IP-based rate limiting to prevent token abuse.

## 🛡️ Security Features

### 1. **API Key Protection**

- DeepSeek API key is **never exposed** to the frontend
- All AI requests go through the secure backend
- Keys are stored in `.env.local` (server-side only)

### 2. **IP-Based Rate Limiting**

- **12 messages per 4-hour window** per IP address
- Prevents abuse even if users clear localStorage
- Works across different browsers/incognito modes
- Automatic cleanup of expired rate limit entries

### 3. **General Rate Limiting**

- 30 requests per minute per IP (prevents DDoS)
- Applied to all API endpoints

### 4. **Input Validation**

- Query length limited to 500 characters
- Type checking on all inputs
- Prevents malformed requests

## 📡 API Endpoints

### `GET /api/health`

Health check endpoint

```json
{
  "status": "ok",
  "timestamp": "2026-02-06T14:30:00.000Z",
  "environment": "development"
}
```

### `GET /api/chat/limit`

Check current rate limit status for the requesting IP

```json
{
  "count": 5,
  "limit": 12,
  "remaining": 7,
  "resetTime": 1738851600000,
  "isLimitReached": false
}
```

### `POST /api/chat`

Main AI chat endpoint (rate limited)

**Request:**

```json
{
  "query": "What projects has Jonald worked on?",
  "relevantChunks": "Retrieved context from RAG..."
}
```

**Response (Success):**

```json
{
  "response": "Jonald has worked on several impressive projects...",
  "rateLimit": {
    "remaining": 6,
    "resetTime": 1738851600000,
    "limit": 12
  }
}
```

**Response (Rate Limited - 429):**

```json
{
  "error": "Chat limit reached",
  "message": "You've reached the limit of 12 messages. Please try again in 180 minutes.",
  "resetTime": 1738851600000,
  "remaining": 0
}
```

### `POST /api/embeddings`

Generate embeddings for RAG (uses Google Gemini)

**Request:**

```json
{
  "text": "Sample text to embed"
}
```

**Response:**

```json
{
  "embedding": [0.123, 0.456, ...]
}
```

## 🚀 Running the Server

### Development (Both Frontend + Backend)

```bash
npm run dev:all
```

This runs:

- Frontend on `http://localhost:5173`
- Backend on `http://localhost:3001`

### Backend Only

```bash
npm run server
```

### Frontend Only

```bash
npm run dev
```

## 🔧 Configuration

All configuration is done via `.env.local`:

```bash
# Backend API URL
VITE_API_URL="http://localhost:3001"

# AI API Keys (Backend only - NEVER commit these!)
VITE_DEEPSEEK_API_KEY="your-deepseek-key"
VITE_GEMINI_API_KEY="your-gemini-key"

# CORS Configuration
FRONTEND_URL="http://localhost:5173"
```

## 📊 Rate Limit Configuration

To change the rate limits, edit `server/index.js`:

```javascript
const CHATS_PER_WINDOW = 12; // Messages per window
const WINDOW_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours
```

## 🌐 Production Deployment

### Option 1: Deploy Backend Separately

1. Deploy backend to a service like Railway, Render, or Heroku
2. Update `VITE_API_URL` in your frontend `.env` to point to production backend
3. Deploy frontend to Vercel/Netlify as usual

### Option 2: Serverless Functions (Vercel)

Convert the Express routes to Vercel serverless functions:

- Create `api/` folder in root
- Move endpoints to individual files
- Use Vercel's built-in rate limiting

### Environment Variables (Production)

Set these in your hosting platform:

- `VITE_DEEPSEEK_API_KEY`
- `VITE_GEMINI_API_KEY`
- `FRONTEND_URL` (your production domain)
- `PORT` (if needed)

## 🔍 Monitoring

The server logs:

- Rate limit checks
- API errors
- Cleanup operations (hourly)

Example logs:

```
🚀 Secure AI Backend running on http://localhost:3001
📊 Rate Limit: 12 messages per 4 hours
🔒 API Key: ✓ Configured
🧹 Cleaned up rate limits. Active IPs: 3
```

## 🛠️ Troubleshooting

### "API Key not configured"

- Check `.env.local` has `VITE_DEEPSEEK_API_KEY`
- Restart the server after adding env variables

### CORS Errors

- Ensure `FRONTEND_URL` matches your frontend URL
- Check that both servers are running

### Rate Limit Not Working

- Clear the in-memory cache by restarting the server
- Check IP detection is working (logs show IP addresses)

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use different API keys** for development and production
3. **Monitor API usage** on DeepSeek dashboard
4. **Set up alerts** for unusual traffic patterns
5. **Consider adding authentication** for production (JWT, API keys, etc.)

## 📝 Notes

- Rate limits are stored **in-memory** (resets on server restart)
- For production, consider using Redis for persistent rate limiting
- IP-based limiting works well for most cases but can be bypassed with VPNs
- Consider adding user authentication for more robust limiting
