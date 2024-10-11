import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROTO_PATH = __dirname + '/../../protos/data.proto'

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  { keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const DataService = (protoDescriptor.data as grpc.GrpcObject).DataService as grpc.ServiceClientConstructor
const dataClient = new DataService('localhost:50050', grpc.credentials.createInsecure())

function sendData() {
  const call = dataClient.SendData((error: grpc.ServiceError | null, summary: any) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`Summary received: Average=${summary.average}, Count=${summary.count}`)
  })

  // Stream data points to the server
  const dataPoints = [
    { id: 1, value: 10.5 },
    { id: 2, value: 20.3 },
    { id: 3, value: 30.8 },
  ]

  dataPoints.forEach((dataPoint) => {
    call.write(dataPoint)
  })

  // Signal the end of the stream
  call.end()
}

sendData()
