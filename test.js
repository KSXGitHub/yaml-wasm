import init, { Message } from './wasm-pack/yaml_wasm.js'
await init()
const message = new Message('Hello, World!!')
console.log(message)
console.log(message.message())
