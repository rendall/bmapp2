import { Context, Callback, APIGatewayEvent } from "aws-lambda"

exports.handler = ( event: APIGatewayEvent, context: Context, callback: Callback ):void => {
  callback(null, { statusCode: 200, body: "Hello world!"})
}

// simple hello world to ensure that the endpoint is building and
// deploying properly