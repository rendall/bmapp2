# bmapp2

This is BMapp, the app to navigate Burning Man.

[![Netlify Status](https://api.netlify.com/api/v1/badges/ebde0ed0-7a99-4169-8773-a2fd08662027/deploy-status)](https://app.netlify.com/sites/bmapp2/deploys)

## development

This is served via Netlify and has two components, the backend and the frontend. Backend development is current.

### installation

- Clone the git repo
- `npm install` : install all dependencies
- Copy the `.env.example`, rename it to be `.env`, and add the Burning Man API

### getting started

- `npm run build` : compile source
- `netlify-lambda -s serve functions` : serve backend
- visit <http://localhost:9000/.netlify/functions/data> or <http://localhost:9000/.netlify/functions/data?year=2015>

### structure

- `./src` contains all source. Develop here. It more or less mirrors its parent in structure
- `./functions-src` contains intermediate compiled Netlify serverless functions
- `./functions` contains compiled Netlify serverless functions
- endpoint is served from `./.netlify/functions/file-name`

### pipeline

Develop using the `.ts` files in `./src/`. After building, issue command `npm run build`
Push to Github master, application shows up at <https://bmapp2.netlify.com/>

## Known bugs

The request and response to the Burning Man API works as expected locally, but
fails silently when uploaded and built in Netlify, returning a status 200 OK,
but no data. The line before `http.get` in `api.js` executes, but nothing
following.
