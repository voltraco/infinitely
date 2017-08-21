const Unendlich = require('.')
const html = require('bel')

const rand = () => Math.random().toString(16).slice(2)
const count = 2e5
console.log(`${count} rows`)

const rows = []
for (let i = 0; i < count; i++) {
  rows.push({
    foo: String(new Date()),
    bar: 'beep',
    beep: rand()
  })
}

const inner = html`<div></div>`
const outer = html`<ul style="height: 800px; width: 600px; overflow: auto; position: relative">${inner}</ul>`
document.body.appendChild(outer)

const render = row => {
  const el = document.createElement('li')
  el.appendChild(
    document.createTextNode(`<li>${row.foo}: ${row.bar} (${row.beep})</li>`)
  )
  return el
}

const update = (row, el) => {
  el.innerText = `<li>${row.foo}: ${row.bar} (${row.beep})</li>`
}

const start = new Date()

const unendlich = new Unendlich({
  rows,
  inner,
  outer,
  render,
  update,
  page: 100,
  padding: 50
})

console.log(`Initialized in ${new Date() - start}ms`)

setInterval(() => {
  for (const row of rows) row.beep = rand()
  unendlich.render({ refresh: true })
}, 1000)
