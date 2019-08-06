"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../common/api");
/** Returns the entire Burning Man data dump as a json object of the form
 * { camps:[], art:[], events:[], timestamp:integer }
 *
 * @param year optional querystring (eg. ?year=2017) defaults to current year
 */
exports.handler = (event, context, callback) => {
    const year = event.queryStringParameters && event.queryStringParameters["year"]
        ? event.queryStringParameters["year"]
        : new Date().getFullYear();
    api_1.getData(year)
        .then(body => callback(null, {
        statusCode: 200,
        body
    }))
        .catch((err) => callback(
    // {
    //   message: err.statusMessage || "Unknown error",
    //   name: `${err.statusCode}` || "500"
    // },
    null, { statusCode: err.statusCode, body: err.statusMessage }));
};
