# MERN Authentication Portal

This React app works with the API in `../backend` to provide registration, login, and a protected Dashboard using JWT.

## Setup
1. In `../backend`, create a `.env` file and run the server (`npm run dev`).
2. In this `frontend` directory:
```
npm install
```
Optionally set `REACT_APP_API_BASE` in `frontend/.env`:
```
REACT_APP_API_BASE=http://localhost:5000/api
```
Start the app:
```
npm start
```

## Pages
- Register: create an account
- Login: obtain a JWT
- Dashboard: protected page fetching `/auth/me`

## Notes
- Token is stored in `localStorage` and attached via axios interceptor
- Update CORS origin in backend `.env` if running on a different host/port
