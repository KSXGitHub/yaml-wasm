#! /usr/bin/env -S deno -A
import * as path from 'https://deno.land/std@v0.40.0/path/mod.ts'
import { dirname } from 'https://deno.land/x/dirname/mod.ts'
import {
  DeepFunc,
  traverseFileSystem
} from 'https://deno.land/x/tree@0.1.1/async.ts'
import {
  FileServer
} from 'https://raw.githubusercontent.com/KSXGitHub/deno_simple_static_server/0.0.0/lib.ts'

const workDir = dirname(import.meta)
Deno.chdir(workDir)

const testFileRegex = /\.test\.(ts|js)$/i
const testFiles: string[] = []
const deep: DeepFunc = param => !['.git', 'node_modules'].includes(param.info.name!)
for await (const item of traverseFileSystem('.', deep)) {
  const filename = path.join(item.container, item.info.name!)
  if (!testFileRegex.test(filename)) continue
  testFiles.push(filename)
}
if (!testFiles.length) {
  console.error('No tests.')
  throw Deno.exit(-1)
}

const addr = '0.0.0.0:4321'
const remoteTestFiles = testFiles.map(filename => `http://${addr}/${filename}`)
const server = new FileServer({
  addr,
  cors: true,
  target: workDir,
  onError (error) {
    console.error('Server encounters an unexpected error.')
    console.error(error)
    server.stop()
    return Deno.exit(-1)
  }
})
server.start().catch(error => {
  console.error('Unexpected error')
  console.error(error)
  return Deno.exit(-1)
})

const cp = Deno.run({
  cmd: [
    'deno', 'test',
    ...remoteTestFiles.map(url => '--reload=' + url),
    '-A',
    ...remoteTestFiles
  ],
  stdout: 'inherit',
  stderr: 'inherit',
  stdin: 'inherit'
})

const { code } = await cp.status()
server.stop()
throw Deno.exit(code)
