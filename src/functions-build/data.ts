import { Context, Callback, APIGatewayEvent } from "aws-lambda";
import { getData, DataRetrievalError } from "../common/api";

/** Returns the entire Burning Man data dump as a json object of the form 
 * { camps:[], art:[], events:[], timestamp:integer }
 * 
 * @param year optional querystring (eg. ?year=2017) defaults to current year
 */
exports.handler = (event: APIGatewayEvent, context: Context, callback: Callback): void => {
  const year =
    event.queryStringParameters && event.queryStringParameters["year"]
      ? event.queryStringParameters["year"]
      : new Date().getFullYear();

  getData(year)
    .then(body => {
      console.info("callback call");
      callback(null, {
        statusCode: 200,
        body
      })
    }
    )
    .catch((err: DataRetrievalError) =>
      callback(
        // {
        //   message: err.statusMessage || "Unknown error",
        //   name: `${err.statusCode}` || "500"
        // },
        null,
        { statusCode: err.statusCode, body: err.statusMessage }
      )
    );
};
