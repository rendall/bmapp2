"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const http = __importStar(require("https"));
dotenv.config();
const API_KEY = process.env.API_KEY;
const BM_URL = process.env.BM_URL;
const basicAuth = { auth: `${API_KEY}:` };
const dataPromise = (path) => (year) => new Promise((resolve, reject) => {
    http.get(`${BM_URL}/${path}?year=${year}`, basicAuth, (res) => {
        const { statusCode, statusMessage } = res;
        res.on("error", error => reject({ statusCode, statusMessage, error }));
        let dump = "";
        res.on("data", data => (dump += data));
        res.on("end", () => resolve(JSON.parse(dump)));
    });
});
const campPromise = dataPromise("camp");
const artPromise = dataPromise("art");
const eventPromise = dataPromise("event");
/** getData(year) returns a promise that yields the entire Burning Man
 * data dump for <year> as a json object of the form
 * { camps:[...], art:[...], events:[...], timestamp:integer }
 */
exports.getData = (year) => Promise.all([campPromise(year), artPromise(year), eventPromise(year)])
    .then(v => ({
    camps: v[0],
    art: v[1],
    events: v[2],
    timestamp: new Date().valueOf()
}))
    .then(data => JSON.stringify(data));
