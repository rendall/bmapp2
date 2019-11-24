import * as dotenv from "dotenv"
import * as http from "https"
import { IncomingMessage, ClientRequest } from "http"
dotenv.config()

const API_KEY = process.env.API_KEY
const BM_URL: string = process.env.BM_URL!
const basicAuth = { auth: `${API_KEY}:` }
const TIMEOUT_MS = 2000;

export type DataRetrievalError = {
  statusCode: number | undefined
  statusMessage: string | undefined
  error: Error
}

const dataPromise = (path: string) => (year: number | string) => {
  console.log(`creating dataPromise(${path}, ${year})`);
  return new Promise((resolve, reject) => {
    const ApiEndpoint = `${BM_URL}/${path}?year=${year}`
    const requestOptions: http.RequestOptions = { ...basicAuth }
    console.log(`creating ClientRequest (${path}, ${year})`);
    // const request: ClientRequest = http.get(
    //   ApiEndpoint,
    //   requestOptions,
    //   (res: IncomingMessage) => {
    //     console.info(`receiving ${path}`)

    //     const { statusCode, statusMessage } = res

    //     console.info({ statusCode, statusMessage })

    //     res.on("error", (error) => {
    //       res.resume()
    //       reject({ statusCode, statusMessage, error })
    //     })
    //     let dump = ""
    //     res.on("data", data => (dump += data))
    //     res.on("end", () => resolve(JSON.parse(dump)))
    //   }
    // )


    try {

      const request = http.get(ApiEndpoint, basicAuth, (res: IncomingMessage) => {
        console.log({ res });

      })

      console.log(`ClientRequest created (${path}, ${year})`);
      const onTimeout = () => request.abort();
      const onError = () => {
        const statusCode = 508
        const statusMessage = "Burning Man API timeout"
        reject({ statusCode, statusMessage })
      }

      request.addListener("error", onError ); // request.abort() throws a fatal error without capturing the "error" event
      request.setTimeout(TIMEOUT_MS, onTimeout)

      console.log(`timeout added to request (${path}, ${year})`);
    } catch (error) {
      console.error("request", { error })

    }

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