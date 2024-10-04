import { RPCClientStub } from './src/models/RPCClientStub'

// Usage
(async () => {
  const rpcClient = new RPCClientStub('http://localhost:3000/rpc')

  try {
    const sum = await rpcClient.add(5, 3)
    console.log('Sum:', sum) // Sum: 8

    const difference = await rpcClient.subtract(10, 4)
    console.log('Difference:', difference) // Difference: 6
  }
  catch (error) {
    if (error instanceof Error) {
      console.error('Error occurred:', error.message)
    }
    else {
      console.error('Unexpected error:', error)
    }
  }
})()
