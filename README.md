# Astronaut ImmuneWatch — UI Prototype

A quick, interactive React + TypeScript frontend prototype for presenting the Astronaut ImmuneWatch concept. It uses synthetic demonstration data only.

## Requirements
- Node.js 20 or newer recommended
- npm

## Run in VS Code
1. Extract this ZIP.
2. Open the extracted `astronaut-immunewatch-prototype` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL Vite prints (usually `http://localhost:5173`).

## Pages
- Mission Dashboard
- Health Profile
- Lab Results
- Trends & Baseline
- Daily Check-in
- Alert Center
- Audit Log

## Interactive demo features
- Add synthetic lab results through the modal.
- Open and update alert statuses.
- Add a demo daily check-in.
- Load five demo scenarios: stable data, repeated trend change, data quality issue, symptom review, and insufficient baseline.
- Toggle local/offline demo mode.
- Search and filter lab results and alerts.

## Important limitations
- This is a frontend-only prototype. It does not include FastAPI, SQLite, authentication, or a real medical analysis engine.
- New records and review status changes are held in React state for the current page session and are not persisted to a backend.
- Chart values, thresholds, alerts, and all crew records are synthetic demo content.
- Do not use this prototype for diagnosis, treatment, or real clinical decisions.

## Build
```bash
npm run build
```
