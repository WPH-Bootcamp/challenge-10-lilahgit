# API Smoke Tests

Replace `YOUR_TOKEN_HERE` with a valid JWT from the login response.

## Login (capture token)
```bash
curl -X POST "https://be-blg-production.up.railway.app/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecureP@ss123"}'
```

## Get current user
```bash
curl -X GET "https://be-blg-production.up.railway.app/api/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Recommended posts
```bash
curl -X GET "https://be-blg-production.up.railway.app/api/posts/recommended?limit=5&page=1"
```

## Search posts
```bash
curl -X GET "https://be-blg-production.up.railway.app/api/posts/search?query=frontend&limit=5&page=1"
```
