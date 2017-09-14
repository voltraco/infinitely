const Unendlich = require('.')
const html = require('bel')

const rand = () => Math.random().toString(16).slice(2)
const count = 2e5 - 80
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
    document.createTextNode(`${row.foo}: ${row.bar} (${row.beep})`)
  )
  return el
}

const update = (row, el) => {
  el.innerText = `${row.foo}: ${row.bar} (${row.beep})`
}

const start = new Date()

const unendlich = new Unendlich({
  rows,
  inner,
  outer,
  render,
  update,
  page: 10,
  padding: 50,
  debug: true
})

console.log(`Initialized in ${new Date() - start}ms`)

setInterval(() => {
  for (const row of rows) row.beep = rand()
  unendlich.render({ refresh: true })
}, 1000)

window.half = () => {
  rows.length = Math.round(rows.length / 2)
  unendlich.setRows(rows)
  unendlich.render({ refresh: true })
}
window.unendlich = unendlich
