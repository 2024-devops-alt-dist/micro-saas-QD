# pwa-planteau-api
# A faire

Monorepo skeleton with `api` and `client` and Docker Compose.

Services:
- `api`: Node/Express backend on port `3000`.
- `client`: Static frontend served by Nginx on port `8080`.

Run locally:

```powershell
docker-compose -f compose.yml up --build
```

CI:
- A placeholder GitHub Actions workflow is available under `.github/workflows/ci.yml`.
