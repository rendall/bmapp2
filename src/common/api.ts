import * as dotenv from "dotenv";
import * as http from "https";
import { IncomingMessage } from "http";
dotenv.config();

const API_KEY = process.env.API_KEY;
const BM_URL = process.env.BM_URL;
const basicAuth = { auth: `${API_KEY}:` };

export type DataRetrievalError = {
 statusCode: number | undefined;
 statusMessage: string | undefined;
 error : Error;
}

const dataPromise = (path: string) => (year: number | string) =>
  new Promise((resolve, reject) => {
    const ApiEndpoint = `${BM_URL}/${path}?year=${year}`
    console.info("fetching", {path, ApiEndpoint, basicAuth, API_KEY});
    http.get(
      ApiEndpoint,
      basicAuth,
      (res: IncomingMessage) => {
        console.info(`receiving ${path}`);

        const { statusCode, statusMessage } = res;

        console.info({ statusCode, statusMessage });

        res.on("error", error => reject(JSON.stringify({ statusCode, statusMessage, error })));
        let dump = "";
        res.on("data", data => (dump += data));
        res.on("end", () => resolve(JSON.parse(dump)));
      }
    );
  });

const campPromise = dataPromise("camp");
const artPromise = dataPromise("art");
const eventPromise = dataPromise("event");

/** getData(year) returns a promise that yields the entire Burning Man 
 * data dump for <year> as a json object of the form 
 * { camps:[...], art:[...], events:[...], timestamp:integer }
 */
export const getData = (year: number | string):Promise<string> =>
  Promise.all([campPromise(year), artPromise(year), eventPromise(year)])
    .then(v => ({
      camps: v[0],
      art: v[1],
      events: v[2],
      timestamp: new Date().valueOf()
    }))
    .then(data => JSON.stringify(data));
