export interface RPCRequest {
  method: string
  params: any[]
}

export interface RPCResponse {
  result: any
  error?: string
}
