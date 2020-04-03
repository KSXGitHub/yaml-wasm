import init, { parse, stringify } from '../../index.js'

const yamlText = `
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
`

init().then(() => {
  console.log('%c parse()', 'font-size: 2em; color: red')
  console.log(parse(yamlText))

  console.log('%c stringify()', 'font-size: 2em; color: red')
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
})
