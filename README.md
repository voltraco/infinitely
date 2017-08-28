# unendlich

[![Development sponsored by voltra.co](https://img.shields.io/badge/Development%20sponsored%20by-Voltra.co-yellow.svg)](https://voltra.co/)
[![build status](https://secure.travis-ci.org/juliangruber/unendlich.svg)](http://travis-ci.org/juliangruber/unendlich)

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

### new Unendlich({ rows, inner, outer, render, update, page = 100, padding = 50, debug = false })

Create a new instance and `.render()` it.

For extra performance, pass `update` which takes existing old row elements and updates them, instead of
creating new ones. For example:

```js
{
  render: row => html`<li>${row.foo}: ${row.bar} (${row.beep})</li>`,
  update: (row, el) => el.innerHTML = `${row.foo}: ${row.bar} (${row.beep})`
}
```

### Unendlich#render({ refresh })

Force a render, if `reset` is `true` it will also rerender already rendered rows.

### Unendlich#setRows(rows)

Update the row content. Doesn't trigger a rerender by itself.

## License

MIT
