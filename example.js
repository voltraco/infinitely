const Unendlich = require('.')
const html = require('bel')

const rows = []
for (let i = 0; i < 1e5; i++) {
  rows.push({
    foo: String(new Date()),
    bar: 'beep',
    beep: Math.random().toString(16).slice(2)
  })
}

const inner = html`<div></div>`
const outer = html`<ul style="height: 800px; width: 600px; overflow: auto">${inner}</ul>`
document.body.appendChild(outer)

const example = new Unendlich({
  rows,
  inner,
  outer,
  render: row => html`<li>${row.foo}: ${row.bar} (${row.beep})</li>`,
  page: 100,
  padding: 50
})
