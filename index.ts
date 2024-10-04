import bodyParser from 'body-parser'
import express from 'express'
import type { RPCRequest, RPCResponse } from './src/types/rpc'

const app = express()
app.use(bodyParser.json())

const rpcMethods: { [key: string]: (...params: any[]) => any } = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
}

app.post('/rpc', (req, res) => {
  const rpcRequest: RPCRequest = req.body

  const method = rpcMethods[rpcRequest.method]

  if (method) {
    const result = method(...rpcRequest.params)
    const response: RPCResponse = { result }
    res.json(response)
  }
  else {
    const response: RPCResponse = { result: null, error: 'Method not found' }
    res.status(404).json(response)
  }
})

app.listen(3000, () => {
  console.log('RPC server is running on port 3000')
})
