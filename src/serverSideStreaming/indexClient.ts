import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import type { StockPrice, StockRequest } from './types'

// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROTO_PATH = __dirname + '/../../protos/stock.proto'

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  { keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const stockService = (protoDescriptor.stock as grpc.GrpcObject).StockService as grpc.ServiceClientConstructor
const stockClient = new stockService('localhost:50050', grpc.credentials.createInsecure())

function streamStockPrices(stockSymbol: string) {
  const request: StockRequest = { stock_symbol: stockSymbol }

  const call = stockClient.StreamStockPrices(request)

  call.on('data', (stockPrice: StockPrice) => {
    console.log(`Received price for ${stockPrice.stock_symbol}: $${stockPrice.price}`)
  })

  call.on('end', () => {
    console.log('Stream ended.')
  })

  call.on('error', (err) => {
    console.error('Error:', err)
  })
}

streamStockPrices('AAPL')
