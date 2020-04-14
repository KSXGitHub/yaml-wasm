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
    title: 'map',
    input: new Map<string, unknown>([
      ['abc', 'def'],
      ['num', 123]
    ]),
    output: [
      '---',
      'abc: def',
      'num: 123'
    ]
  },

  {
    title: 'mixed',
    input: {
      abc: 123,
      def: 456,
      map: new Map<unknown, unknown>([
        ['abc', 'def'],
        [{ key: 'object' }, new Map([['value', 'map']])],
        [new Map([['key', 'map']]), { value: 'object' }],
        ['object', { a: 0, b: 1 }]
      ]),
      complex_map: new Map<unknown, unknown>([
        [[0, 1, 2, 3], 'array'],
        [{ a: 0, b: 1 }, 'object'],
        [new Map(), 'map']
      ])
    },
    output: [
      '---',
      'abc: 123',
      'def: 456',
      'map:',
      '  abc: def',
      '  ? key: object',
      '  : value: map',
      '  ? key: map',
      '  : value: object',
      '  object:',
      '    a: 0',
      '    b: 1',
      'complex_map:',
      '  ? - 0',
      '    - 1',
      '    - 2',
      '    - 3',
      '  : array',
      '  ? a: 0',
      '    b: 1',
      '  : object',
      '  ? {}',
      '  : map'
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
