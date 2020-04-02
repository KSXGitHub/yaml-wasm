import init, { parse, stringify } from '../../index.js'
await init()

console.log('== parse ==')
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
console.log()

console.log('== stringify ==')
for (const item of [
  {
    int: 123,
    float: 456.789,
    text: 'hello',
    object: { foo: 'bar' },
    other_primitives: [null, true, false]
  },
  null,
  'Hello There',
  {
    invalid_values: [
      Symbol('hello'),
      console.log
    ]
  }
]) {
  console.log()
  console.log(stringify(item))
}
console.log()
