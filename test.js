import init, { Message } from './index.js'
await init()
const message = new Message('Hello, World!!')
console.log(message)
console.log(message.message())
