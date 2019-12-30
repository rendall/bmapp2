# bmapp2

This is BMapp, the app to navigate Burning Man.

[![Netlify Status](https://api.netlify.com/api/v1/badges/ebde0ed0-7a99-4169-8773-a2fd08662027/deploy-status)](https://app.netlify.com/sites/bmapp2/deploys)

A lightweight, performant progressive web app that allows a user to navigate Burning Man using a device with no or low-bandwidth connection to the internet. A user at Burning Man can search using text, location or time to find nearby events, camps and art; and plan an itinerary. At other times and places, a user can explore Burning Man events of the past.

## development

This is served via Netlify and has two components, the backend and the frontend. Backend and middle-ware development is ongoing. Frontend development is future.

The code development uses Typescript and SASS with the frontend framework TBD.

### installation for developers

- Clone the git repo
- `npm install` : install all dependencies
- Copy the `.env.example`, rename it to be `.env`, and add the Burning Man API

### getting started

- `npm run build` : compile source
- `netlify-lambda -s serve functions` : serve backend
- visit <http://localhost:9000/.netlify/functions/data> or <http://localhost:9000/.netlify/functions/data?year=2015>

### directory structure

- `./src` : all source. Develop here in the `.ts` files. It's the only directory to be tracked in the git repo
- `./static` : static assets to be used in the application, moved into `./app` during build

#### after build

The project root directory on the server will contain:

- `./app` : the application is served from this folder, containing all assets and compiled code
- `./functions` : Netlify serverless functions, endpoints to the backend

As well, these are intermediate or development folders and will be deleted after production build:

- `./scripts` : console commands for building or serving the application
- `./common` : code shared in common with the backend and frontend

Within `./src` are:

- `./src/functions-src` : source for Netlify serverless functions
  - NB: endpoint is served from `./.netlify/functions/<file-name>`
  - There currently is no need for these functions
- `./src/common` : code that is shared among modules
- `./src/app` : application-related code, assets and webpack entry points
- `./src/app/data` contains collated data from the BM API
- `./search` : module and test files related to the search functionality

### architecture

- search
- saving / local
- UI
- developer installation
- PWA / user installation

### pipeline

Develop using the `.ts` files in `./src/`. After building, issue command `npm run build`
Push to Github master, application shows up at <https://bmapp2.netlify.com/>

#### build steps

The command to build is `npm run build`, which will perform these steps in order:

1. remove previous `./app` and `./common` directories
1. compile Typescript into javascript in `./src-compiled`
1. tree-shake and bundle via webpack into `./app`
1. move static assets from `./static` to `./app`
1. build and bundle Netlify serverless functions as API endpoints into `./functions`
1. build scripts
1. download, clean and write data from the Burning Man API as `.json` files
1. remove intermediate directories such as `./common`, `./src-compiled` and `./scripts`

#### tests

Testing is via [jest](https://jestjs.io) with the command `npm test`

Tests are performed on compiled source code in `./src-compiled`,
therefore `npm test` will compile the source code with the `tsc`
command, then compile test files with `tsc -p tsconfig.test.json`, then
finally run the tests.

If you want to watch for tests, you will need to run 2 separate watch processes:

- `npx tsc --watch`
- `npx tsc -p tsconfig.tests.json`
- `npx jest --watch`

##### data integrity tests

After downloading the data, you may want to run the data integrity tests. This will highlight issues with the data such as events that have no location, or have ending times earlier than their start time. For more information see the _testing_ section in `.src/scripts/README.md`

The `data.test.js` file will fail out-of-the-box. If you want to test for data integrity follow these steps:

1. Ensure you have a Burning Man API key and that it is in the `.env` file
1. `npx tsc`
1. `npx tsc -p tsconfig.scripts.json`
1. `node scripts/getdata`
1. `mkdir data`
1. `mv ./app/data/*.json data`
1. `npx tsc -p tsconfig.tests.json`
1. `mv ./src-compiled/app/data/data.test.js data`
1. then run test: `npx jest data`

#### git branching model

The git branching model is *currently* "solo developer pushes directly to master which deploys straight to production". Don't judge.

With collaborators and/or as the application development matures, this will (likely) change to:

- `development` branch that takes pull-requests (PR)
- PRs reviewed, tested and merged to `development`
- after testing, `development` is squashed to `master`
- changes to `master` are automatically deployed

### Netlify

This app is hosted for free at the almighty Netlify. I will add more about that here in time to come, but among other important points, [be sure to add environment variables](https://docs.netlify.com/configure-builds/environment-variables/) to the site. That is to say, that the `.env` file variables should be manually entered in the site dashboard.

## known issues

Netlify's serverless functions will not return the entire uncompressed BM json object because AWS Lambda functions have a practical upper limit of 4MB on response body size, which prevents their serving uncompressed BM data files. This is a blocker for now.

## contributing

Yes, please. I'm happy to collaborate, particularly with graphic, UI- and UX-designers. But do let me know if you fork. I have a tendency to `git push --force` unless I know that someone else is attached to the commit history.
