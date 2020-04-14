import init, { parse } from '../index.js'
import {
  assert,
  assertEquals,
  tryExec
} from './deps.ts'

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

Deno.test('parse into objects successfully', async () => {
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

Deno.test('parse into maps successfully', async () => {
  await init()
  const actual = parse(yamlText, {
    map: true
  })
  assertEquals(actual, [
    new Map<string, unknown>([
      ['int', 123],
      ['float', 456.789],
      ['text', 'hello'],
      ['array', ['abc', 'def', 123]],
      ['object', new Map([['foo', 'bar']])],
      ['other_primitives', [null, true, false]]
    ]),
    null,
    'Hello There'
  ])
})

Deno.test('parse failure', async () => {
  await init()
  const actual = tryExec(() => parse(': this : is : not : valid : yaml :'))
  assert(actual.tag === false, 'not an err')
  assertEquals(actual.error.name, 'SyntaxError')
  assertEquals(actual.error.message, 'mapping values are not allowed in this context at line 1 column 13')
})
