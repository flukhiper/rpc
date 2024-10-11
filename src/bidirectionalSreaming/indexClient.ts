import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROTO_PATH = __dirname + '/../../protos/chat.proto'

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  { keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const ChatService = (protoDescriptor.chat as grpc.GrpcObject).ChatService as grpc.ServiceClientConstructor
const chatClient = new ChatService('localhost:50050', grpc.credentials.createInsecure())

function startChat() {
  const call = chatClient.Chat()

  // Simulate sending multiple messages from the client
  const messages = [
    { user: 'Alice', message: 'Hello, how are you?' },
    { user: 'Alice', message: 'What’s your name?' },
    { user: 'Alice', message: 'Have a nice day!' },
  ]

  // Send messages to the server
  messages.forEach((msg, idx) => {
    setTimeout(() => {
      console.log(`Client sends: ${msg.message}`)
      call.write(msg)
    }, idx * 1000) // Send each message with 1 second delay
  })

  // Listen for responses from the server
  call.on('data', (response) => {
    console.log(`Server responds: ${response.message}`)
  })

  // Handle stream closure
  call.on('end', () => {
    console.log('Stream closed by the server.')
  })

  // Simulate ending the stream after sending all messages
  setTimeout(() => {
    console.log('Client finished sending messages.')
    call.end() // Signal the end of the client-side stream
  }, messages.length * 1000 + 500) // End after the last message is sent
}

// Run the chat client
startChat()
