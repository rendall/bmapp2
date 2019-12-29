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
const API_HOST = process.env.API_HOST;
const API_PATH = process.env.API_PATH;
const TIMEOUT_MS = 5000;
const TIMEOUT_ERROR_STATUS_CODE = 504; // As a const, to clarify meaning of '504'
const auth = `${API_KEY}:`;
const apiPromise = (endpoint) => (year) => {
    return new Promise((resolve, reject) => {
        const hostname = `${API_HOST}`;
        const path = `${API_PATH}/${endpoint}?year=${year}`;
        const requestOptions = { hostname, path, auth };
        const onResponse = (res) => {
            const { statusCode, statusMessage } = res;
            console.info(`Received response for ${endpoint} ${year}: ${statusCode}: ${statusMessage}`);
            res.on("error", (error) => {
                console.error(`${endpoint} error`, error);
                res.resume();
                reject({ statusCode, statusMessage });
            });
            let dump = "";
            res.on("data", data => (dump += data));
            res.on("end", () => {
                console.info(`${year} ${endpoint} dump end`);
                try {
                    const json = JSON.parse(dump);
                    resolve(json);
                }
                catch (error) {
                    console.error(`${year} ${endpoint} error:`, { error });
                }
            });
        };
        const request = http.get(requestOptions, onResponse);
        console.info(`Sent request for ${endpoint} ${year}`);
        const onTimeout = () => request.abort();
        const onRequestError = (error) => {
            switch (error.message) {
                case "socket hang up":
                    if (request.aborted) {
                        reject({ statusCode: TIMEOUT_ERROR_STATUS_CODE, statusMessage: "Burning Man API timeout" });
                        break;
                    }
                default:
                    console.error(error);
                    reject({ statusCode: 500, statusMessage: `${error.name}` });
                    break;
            }
        };
        request.addListener("error", onRequestError);
        request.setTimeout(TIMEOUT_MS, onTimeout);
    }).catch((err) => { throw err; });
};
const campPromise = apiPromise("camp");
const artPromise = apiPromise("art");
const eventPromise = apiPromise("event");
/** getData(year) returns a promise that yields the entire Burning Man
 * data dump for <year> as a json object of the form
 * { camps:[...], art:[...], events:[...], timestamp:integer }
 */
exports.getData = (year) => {
    console.info(`Getting data for ${year}`);
    return Promise.all([campPromise(year), artPromise(year), eventPromise(year)])
        .then(v => { console.info("Retrieved all data"); return v; })
        .then(v => ({
        camps: v[0],
        art: v[1],
        events: v[2],
        timestamp: new Date().valueOf()
    }))
        .then(v => { console.info("Built data model"); return v; })
        .then(data => JSON.stringify(data))
        .catch(err => { throw err; });
};
