import { Context, Callback, APIGatewayEvent } from "aws-lambda"
import { getData, DataRetrievalError } from "../common/api"

exports.handler = ( event: APIGatewayEvent, context: Context, callback: Callback ):void => {
  callback(null, { statusCode: 200, body: "Hello world!"})
}
