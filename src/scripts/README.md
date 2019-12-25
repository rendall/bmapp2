# Scripts source

Build these files with this command: `tsc -p tsconfig.scripts.json`.
They will be built and deployed to `./scripts` directory. Then to use
them, in terminal from project root, write:
`node scripts/<filename>`

## getdata

Before building, ensure that the `.env` file exists in the project
root directory, populated according to `.env.example`. This will
require a Burningman API key, which you can apply for by emailing
the burning man organization.

This command is intended to download and collate data from the
BM API
