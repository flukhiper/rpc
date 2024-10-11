import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import type { StockPrice, StockRequest } from './types'

// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROTO_PATH = __dirname + '/../../protos/stock.proto'

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const stockService = (protoDescriptor.stock as grpc.GrpcObject).StockService as grpc.ServiceClientConstructor

// Server-side streaming function implementation
const streamStockPrices = (call) => {
  const request: StockRequest = call.request

  console.log(`Received request for stock: ${request.stock_symbol}`)

  // Simulate streaming 10 stock prices
  let price = 100
  for (let i = 0; i < 10; i++) {
    const stockPrice: StockPrice = {
      stock_symbol: request.stock_symbol,
      price: price++,
    }

    call.write(stockPrice) // Send the stock price
    console.log(`Sending price for ${request.stock_symbol}: $${stockPrice.price}`)

    // Simulate a delay between sending messages
    setTimeout(() => {}, 1000)
  }

  call.end() // Indicate that the stream is finished
}

// Start the gRPC server
function main() {
  const server = new grpc.Server()
  server.addService(stockService.service, { StreamStockPrices: streamStockPrices })

  server.bindAsync('0.0.0.0:50050', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) {
      return console.error(err)
    }
    console.log(`gRPC listening on ${port}`)
  })
}

main()
