#! /usr/bin/env -S deno -A
import { dirname } from 'https://deno.land/x/dirname/mod.ts'
import { sh } from 'https://deno.land/x/drake@v0.41.0/mod.ts'
import run from 'https://deno.land/x/test_on_localhost@0.2.2/run.ts'
const workDir = dirname(import.meta)
Deno.chdir(workDir)
await sh('make lib')
const hostname = '0.0.0.0'
const port = 4321
const { code } = await run({ hostname, port })
throw Deno.exit(code)
