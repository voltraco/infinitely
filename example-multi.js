const Unendlich = require('.')
const html = require('bel')

const rand = () => Math.random().toString(16).slice(2)
const count = 2e5 - 80
let tilesPerRow
console.log(`${count} tiles`)

const tiles = []
for (let i = 0; i < count; i++) {
  tiles.push({
    foo: String(new Date(Math.random() * 1e13)),
    bar: 'beep',
    beep: rand()
  })
}

let rows = []

const inner = html`<div></div>`
const outer = html`<ul style="height: 800px; width: 600px; overflow: auto; position: relative">${inner}</ul>`
document.body.appendChild(outer)

const render = row => {
  const el = document.createElement('li')
  for (const tile of row) {
    const _el = document.createElement('span')
    Object.assign(_el.style, {
      width: `${100 / tilesPerRow}%`,
      display: 'inline-block'
    })
    _el.innerHTML = `
      <strong>${tile.foo}</strong><br />
      ${tile.bar} (${tile.beep})<br /><br />
    `
    el.appendChild(_el)
  }
  return el
}

const start = new Date()

const unendlich = new Unendlich({
  rows,
  inner,
  outer,
  render,
  // update,
  page: 10,
  padding: 50,
  debug: true
})

console.log(`Initialized in ${new Date() - start}ms`)

setInterval(() => {
  for (const tile of tiles) tile.beep = rand()
  unendlich.render({ refresh: true })
}, 1000)

window.unendlich = unendlich

const scale = tpr => {
  tilesPerRow = tpr
  rows = []
  for (
    let i = 0;
    i < Math.floor(tiles.length / tilesPerRow);
    i += tilesPerRow
  ) {
    const row = []
    for (let j = 0; j < tilesPerRow; j++) row.push(tiles[i + j])
    rows.push(row)
  }
  unendlich.setRows(rows)
  unendlich.render({ refresh: true })
}
scale(3)

window.scale = scale
