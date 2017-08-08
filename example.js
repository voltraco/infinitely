const Unendlich = require('.')
const html = require('bel')

const rows = []
for (let i = 0; i < 2e5; i++) {
  rows.push({
    foo: String(new Date()),
    bar: 'beep',
    beep: Math.random().toString(16).slice(2)
  })
}

const inner = html`<div></div>`
const outer = html`<ul style="height: 800px; width: 600px; overflow: auto">${inner}</ul>`
document.body.appendChild(outer)
const render = row => html`<li>${row.foo}: ${row.bar} (${row.beep})</li>`

const start = new Date()

new Unendlich({
  rows,
  inner,
  outer,
  render,
  page: 100,
  padding: 50
})

console.log(`Initialized in ${new Date() - start}ms`)
