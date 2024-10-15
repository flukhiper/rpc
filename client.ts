import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './server'
//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
const trpc = createTRPCProxyClient <AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000/trpc',
    }),
  ],
})

async function main() {
  // Call procedure functions

  // 💡 Tip, try to:
  // - hover any types below to see the inferred types
  // - Cmd/Ctrl+click on any function to jump to the definition
  // - Rename any variable and see it reflected across both frontend and backend

  const users = await trpc.getUser.query('1')
  //    ^?
  console.log('Users:', users)

  const createdUser = await trpc.createUser.mutate({ name: 'Alice', age: 25 })
  //    ^?
  console.log('Created user:', createdUser)
}

main()
