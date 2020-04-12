import init, { parse } from '../index.js'
import { assertEquals } from './deps.ts'

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

Deno.test('parse', async () => {
  await init()
  const actual = parse(yamlText)
  assertEquals(actual, [
    {
      int: 123,
      float: 456.789,
      text: 'hello',
      array: ['abc', 'def', 123],
      object: { foo: 'bar' },
      other_primitives: [null, true, false]
    },
    null,
    'Hello There'
  ])
})
