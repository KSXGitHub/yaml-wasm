import init, { parse } from '../../index.js'
init().then(async () => {
  const response = await fetch('./valid.yaml')
  console.log(parse(await response.text()))
}).catch(console.error)
