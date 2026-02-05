# Comments Smoke Tests

Replace `YOUR_TOKEN_HERE` with a valid JWT.

## Get comments for a post
```bash
curl -X GET "https://be-blg-production.up.railway.app/api/comments/1"
```

## Create comment (protected)
```bash
curl -X POST "https://be-blg-production.up.railway.app/api/comments/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"content":"This is a great post!"}'
```

## Delete comment (protected)
```bash
curl -X DELETE "https://be-blg-production.up.railway.app/api/comments/123" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
