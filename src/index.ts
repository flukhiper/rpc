import { fileURLToPath } from 'url'
import { dirname } from 'path'

// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROTO_PATH = __dirname + '/../protos/helloworld.proto'

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  { keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld as grpc.GrpcObject

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call: any, callback: any) {
  callback(null, { message: 'Hello ' + call.request.name })
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  const server = new grpc.Server()
  server.addService((hello_proto.Greeter as grpc.ServiceClientConstructor).service, { sayHello: sayHello })
  server.bindAsync('0.0.0.0:50050', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) {
      return console.error(err)
    }
    console.log(`gRPC listening on ${port}`)
  })
}

main()
