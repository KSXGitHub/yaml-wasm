import init, { stringify } from '../index.js'
import { assertEquals } from './deps.ts'

interface Case {
  readonly title: string
  readonly input: unknown
  readonly output: readonly string[]
}

const cases: Case[] = [
  {
    title: 'object',
    input: {
      int: 123,
      float: 456.789,
      text: 'hello',
      object: { foo: 'bar' },
      other_primitives: [null, true, false]
    },
    output: [
      '---',
      'int: 123',
      'float: 456.789',
      'text: hello',
      'object:',
      '  foo: bar',
      'other_primitives:',
      '  - ~',
      '  - true',
      '  - false'
    ]
  },

  {
    title: 'null',
    input: null,
    output: [
      '---',
      '~'
    ]
  },

  {
    title: 'invalid values',
    input: {
      invalid_values: [
        Symbol('hello'),
        console.log
      ]
    },
    output: [
      '---',
      'invalid_values: []'
    ]
  }
]

cases.forEach(({ title, input, output }) => Deno.test(title, async () => {
  await init()
  const actual = stringify(input)
  assertEquals(actual, output.join('\n'))
}))
