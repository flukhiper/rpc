import axios from 'axios'
import type { RPCRequest, RPCResponse } from './src/types/rpc'

async function callRPC(method: string, params: any[]): Promise<any> {
  const rpcRequest: RPCRequest = { method, params }

  try {
    const response = await axios.post<RPCResponse>('http://localhost:3000/rpc', rpcRequest)
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data.result
  }
  catch (error) {
    console.error('RPC Error:', error)
    throw error
  }
}

(async () => {
  try {
    const sum = await callRPC('add', [5, 3])
    console.log('Sum:', sum) // Sum: 8

    const difference = await callRPC('subtract', [10, 4])
    console.log('Difference:', difference) // Difference: 6
  }
  catch (error) {
    console.error('Error occurred:', (error as Error).message)
  }
})()
