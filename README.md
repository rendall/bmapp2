# bmapp2

This is BMapp, the app to navigate Burning Man.

[![Netlify Status](https://api.netlify.com/api/v1/badges/ebde0ed0-7a99-4169-8773-a2fd08662027/deploy-status)](https://app.netlify.com/sites/bmapp2/deploys)

## development

This is served via Netlify and has two components, the backend and the frontend

### installation

- Clone the git repo
- `npm install` : install all dependencies
- Copy the `.env.example`, rename it to be `.env`, and add the Burning Man API

### getting started

- `npm run build` : compile source
- `netlify-lambda -s serve functions` : serve backend
- visit <http://localhost:9000/.netlify/functions/data> or <http://localhost:9000/.netlify/functions/data?year=2015>

### structure

- `./src` contains all source. Develop here.
- `./functions-src` contains intermediate compiled Netlify serverless functions
- `./functions` contains compiled Netlify serverless functions
  - endpoint is served from `./.netlify/functions/file-name`

### pipeline

Push to Github master, application shows up at <https://bmapp2.netlify.com/>