import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import type { ChatMessage } from './types'

// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROTO_PATH = __dirname + '/../../protos/chat.proto'

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const ChatService = (protoDescriptor.chat as grpc.GrpcObject).ChatService as grpc.ServiceClientConstructor

// Implement the Chat service
const chat = (call) => {
  // When receiving data from the client
  call.on('data', (chatMessage: ChatMessage) => {
    console.log(`Received message from ${chatMessage.user}: ${chatMessage.message}`)

    // Send a response back to the client
    call.write({
      user: 'Server',
      message: `Echoing: "${chatMessage.message}" from user: ${chatMessage.user}`,
    })
  })

  // When the client closes the stream
  call.on('end', () => {
    console.log('Client finished streaming.')
    call.end() // Close the server-side stream
  })
}

// Start the gRPC server
function main() {
  const server = new grpc.Server()
  server.addService(ChatService.service, { Chat: chat })

  server.bindAsync('0.0.0.0:50050', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) {
      return console.error(err)
    }
    console.log(`gRPC listening on ${port}`)
  })
}

main()
