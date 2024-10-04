import axios from 'axios'
import type { RPCRequest, RPCResponse } from '../types/rpc'

// Client-side stub for RPC
export class RPCClientStub {
  private url: string

  constructor(url: string) {
    this.url = url
  }

  // The stub function for calling remote methods
  private async callRPC(method: string, params: any[]): Promise<any> {
    const rpcRequest: RPCRequest = { method, params }

    try {
      const response = await axios.post<RPCResponse>(this.url, rpcRequest)
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

  // Stub method for 'add'
  public async add(a: number, b: number): Promise<number> {
    return this.callRPC('add', [a, b])
  }

  // Stub method for 'subtract'
  public async subtract(a: number, b: number): Promise<number> {
    return this.callRPC('subtract', [a, b])
  }
}
