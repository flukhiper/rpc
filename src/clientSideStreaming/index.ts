import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import type { DataPoint } from './types'

// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROTO_PATH = __dirname + '/../../protos/data.proto'

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const DataService = (protoDescriptor.data as grpc.GrpcObject).DataService as grpc.ServiceClientConstructor

// Server-side streaming function implementation
const sendData = (call, callback) => {
  let total = 0
  let count = 0

  // Process each data point from the stream
  call.on('data', (dataPoint: DataPoint) => {
    total += dataPoint.value
    count += 1
  })

  // Handle the end of the stream
  call.on('end', () => {
    const average = count > 0 ? total / count : 0
    callback(null, { average, count })
  })
}

// Start the gRPC server
function main() {
  const server = new grpc.Server()
  server.addService(DataService.service, { SendData: sendData })

  server.bindAsync('0.0.0.0:50050', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) {
      return console.error(err)
    }
    console.log(`gRPC listening on ${port}`)
  })
}

main()
