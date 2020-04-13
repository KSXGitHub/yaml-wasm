#! /usr/bin/env -S deno -A
import { dirname } from 'https://deno.land/x/dirname/mod.ts'
import { sh } from 'https://deno.land/x/drake@v0.16.0/mod.ts'
import run from 'https://raw.githubusercontent.com/KSXGitHub/deno_run_tests_on_localhost/0.0.1/run.ts'
const workDir = dirname(import.meta)
Deno.chdir(workDir)
await sh('make lib')
const hostname = '0.0.0.0'
const port = 4321
const { code } = await run({ hostname, port })
throw Deno.exit(code)
