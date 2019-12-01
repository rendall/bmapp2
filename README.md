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

### directory structure

- `./src` contains all source. Develop here. it's the only directory to be tracked in the repo
- `./functions-src` contains intermediate compiled Netlify serverless functions
- `./functions` contains compiled Netlify serverless functions
- `./common` contains code that can be shared among other modules
- `./app` is the root of the frontend, and webservers should serve this directory
- endpoint is served from `./.netlify/functions/file-name`

### architecture

- search
- saving / local
- UI
- developer installation
- PWA / user installation



### pipeline

Develop using the `.ts` files in `./src/`. After building, issue command `npm run build`
Push to Github master, application shows up at <https://bmapp2.netlify.com/>

## known bugs

Netlify's serverless functions will not return the entire uncompressed BM
json object because AWS Lambda functions have a practical upper limit of 4MB
on response body size.
