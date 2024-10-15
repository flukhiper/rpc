import express from 'express'
import * as trpc from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { z } from 'zod'
import cors from 'cors'

// Create a tRPC context
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({})
type Context = trpc.inferAsyncReturnType<typeof createContext>

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = trpc.initTRPC.context<Context>().create()

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
const router = t.router
const publicProcedure = t.procedure

const appRouter = router({
  getUser: publicProcedure.input(z.string()).query(({ input }) => {
    return { id: input, name: 'John Doe', age: 30 }
  }),
  createUser: publicProcedure.input(z.object({ name: z.string(), age: z.number() })).mutation(({ input }) => {
    return { id: 'user-1', name: input.name, age: input.age }
  }),
})

// Initialize the Express app
const app = express()
app.use(cors())
app.use(express.json())

// Apply the tRPC router as middleware
app.use('/trpc', trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
}))

// Start the server
const PORT = 4000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// Export the router type to use it on the client side
export type AppRouter = typeof appRouter
