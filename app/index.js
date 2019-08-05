"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../common/api");
const fs = __importStar(require("fs"));
const YEAR = 2019;
const dir = `${__dirname}/data`;
api_1.getData(YEAR)
    .then(data => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFile(`${dir}/${YEAR}.json`, data, err => {
        if (err)
            throw err;
        else
            throw "Unknown file write error";
    });
})
    .then(() => console.log("done"))
    .catch(err => console.error(err));
