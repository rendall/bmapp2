import * as dotenv from "dotenv"
import * as http from "https"
import { IncomingMessage, ClientRequest } from "http"
dotenv.config()

const API_KEY = process.env.API_KEY
const BM_URL = process.env.BM_URL
const auth = `${API_KEY}:`
const hostname = "api.burningman.org" // BM_URL
const TIMEOUT_MS = 2000;

export type DataRetrievalError = {
  statusCode: number | undefined
  statusMessage: string | undefined
  error: Error
}

const dataPromise = (endpoint: string) => (year: number | string) => {
  console.log(`creating dataPromise(${endpoint}, ${year})`);
  return new Promise((resolve, reject) => {
    const ApiEndpoint = `${BM_URL}/${endpoint}?year=${year}`
    const path = `/api/v1/${endpoint}?year=${year}`
    const requestOptions: http.RequestOptions = { hostname, path, auth }
    console.log(`creating ClientRequest (${endpoint}, ${year})`, {requestOptions});
    const request: ClientRequest = http.get(
      // ApiEndpoint,
      requestOptions,
      (res: IncomingMessage) => {
        console.info(`receiving ${endpoint}`)

        const { statusCode, statusMessage } = res

        console.info({ statusCode, statusMessage })

        res.on("error", (error) => {
          res.resume()
          reject({ statusCode, statusMessage, error })
        })
        let dump = ""
        res.on("data", data => (dump += data))
        res.on("end", () => resolve(JSON.parse(dump)))
      }
    )

    console.log(`ClientRequest created (${endpoint}, ${year})`);
    const onTimeout = () => request.abort();

    // request.addListener("error", () => {
    //   const statusCode = 508
    //   const statusMessage = "Burning Man API timeout"
    //   reject({ statusCode, statusMessage })
    // }); // request.abort() throws a fatal error without capturing the "error" event

    // request.setTimeout(TIMEOUT_MS, onTimeout) 

    console.log(`timeout added to request (${endpoint}, ${year})`);

  }).catch((err) => { throw err })
}
const campPromise = dataPromise("camp")
const artPromise = dataPromise("art")
const eventPromise = dataPromise("event")

/** getData(year) returns a promise that yields the entire Burning Man 
 * data dump for <year> as a json object of the form 
 * { camps:[...], art:[...], events:[...], timestamp:integer }
 */
export const getData = (year: number | string): Promise<string> => {
  console.log(`getData(${year})`);
  return Promise.all([campPromise(year), artPromise(year), eventPromise(year)])
    .then(v => { console.info("retrieved all data, creating object"); return v; })
    .then(v => ({
      camps: v[0],
      art: v[1],
      events: v[2],
      timestamp: new Date().valueOf()
    }))
    .then(data => JSON.stringify(data))
    .catch(err => { throw err })
}