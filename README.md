# unendlich

[![Development sponsored by voltra.co](https://img.shields.io/badge/Development%20sponsored%20by-Voltra.co-yellow.svg)](https://voltra.co/)

Infinite scrolling component that works with _any_ DOM structure and loads content lazily.

## Usage

There needs to be an outer and an inner element, the outer element having

- a fixed height
- overflow auto
- position relative

The rest is up to you:

```js
const Unendlich = require('unendlich')
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
```

## Installation

```bash
$ npm install unendlich
```

## API

### new Unendlich({ rows, inner, outer, render, page = 100, padding = 50 })

Create a new instance and `.render()` it.

### Unendlich#render({ refresh })

Force a render, if `reset` is `true` it will also rerender already rendered rows.

## License

MIT
