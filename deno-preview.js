import init, { parse } from './index.js'
await init()
console.log(parse(`
---
int: 123
float: 456.789
text: hello
array:
  - abc
  - def
  - 123
object:
  foo: bar
other_primitives:
  - null
  - true
  - false
---
null
---
Hello There
`))
