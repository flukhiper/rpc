import { fileURLToPath } from 'url'
import { dirname } from 'path'

// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROTO_PATH = __dirname + '/../../protos/helloworld.proto'

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

function main() {
  const target = 'localhost:50050'
  const client = new (hello_proto.Greeter as grpc.ServiceClientConstructor)(target,
    grpc.credentials.createInsecure())
  const user = 'world'
  client.sayHello({ name: user }, function (err: any, response: any) {
    console.log('Greeting:', response.message)
  })
}

main()
