import {
  path,
  fs,
  dirname
} from './deps.ts'

const __dirname = dirname(import.meta)
const filename = path.join(__dirname, '../lib/yaml_wasm.d.ts')
const oldContent = await fs.readFileStr(filename)

const newContent = prependIfMissing(
  oldContent,

  // Some types aren't supported by Deno
  'type RequestInfo = never',
  'type BufferSource = never'
)

await fs.writeFileStr(filename, newContent)

function prependIfMissing (text: string, ...lines: string[]): string {
  const existingLines = text.split('\n')
  for (const line of [...lines].reverse()) {
    if (existingLines.includes(line)) continue
    existingLines.unshift(line)
  }
  return existingLines.join('\n')
}
