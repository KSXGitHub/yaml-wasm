import init, { Message } from './wasm-pack/yaml_wasm.js'
await init()
const message = Message.new('Hello, World!')
console.log(message)
console.log(message.message())
